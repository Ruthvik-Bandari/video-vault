package com.videovault.service;

import com.videovault.model.SearchResponse;
import com.videovault.model.Video;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class YouTubeService {

    @Value("${youtube.api.key:}")
    private String apiKey;

    @Value("${youtube.api.enabled:false}")
    private boolean apiEnabled;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
    private static final String YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";

    public YouTubeService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public SearchResponse searchVideos(String query, int maxResults, String pageToken) {
        if (!apiEnabled || apiKey == null || apiKey.isEmpty()) {
            return getDemoResults(query, maxResults);
        }

        try {
            return searchYouTube(query, maxResults, pageToken);
        } catch (Exception e) {
            System.err.println("YouTube API error: " + e.getMessage());
            return getDemoResults(query, maxResults);
        }
    }

    private SearchResponse searchYouTube(String query, int maxResults, String pageToken) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(YOUTUBE_SEARCH_URL)
                .queryParam("part", "snippet")
                .queryParam("q", query)
                .queryParam("type", "video")
                .queryParam("maxResults", maxResults)
                .queryParam("key", apiKey);

        if (pageToken != null && !pageToken.isEmpty()) {
            builder.queryParam("pageToken", pageToken);
        }

        String response = restTemplate.getForObject(builder.toUriString(), String.class);
        return parseSearchResponse(response, query);
    }

    private SearchResponse parseSearchResponse(String jsonResponse, String query) {
        List<Video> videos = new ArrayList<>();
        String nextPageToken = null;
        int totalResults = 0;

        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            
            if (root.has("nextPageToken")) {
                nextPageToken = root.get("nextPageToken").asText();
            }
            
            if (root.has("pageInfo") && root.get("pageInfo").has("totalResults")) {
                totalResults = root.get("pageInfo").get("totalResults").asInt();
            }

            JsonNode items = root.get("items");
            if (items != null && items.isArray()) {
                for (JsonNode item : items) {
                    Video video = new Video();
                    
                    // Get video ID
                    JsonNode idNode = item.get("id");
                    if (idNode != null && idNode.has("videoId")) {
                        video.setId(idNode.get("videoId").asText());
                    }

                    // Get snippet details
                    JsonNode snippet = item.get("snippet");
                    if (snippet != null) {
                        video.setTitle(getTextValue(snippet, "title"));
                        video.setDescription(getTextValue(snippet, "description"));
                        video.setChannel(getTextValue(snippet, "channelTitle"));
                        
                        // Parse published date
                        String publishedAt = getTextValue(snippet, "publishedAt");
                        if (publishedAt != null) {
                            video.setPublishedAt(formatDate(publishedAt));
                        }

                        // Get thumbnail
                        JsonNode thumbnails = snippet.get("thumbnails");
                        if (thumbnails != null) {
                            if (thumbnails.has("high")) {
                                video.setThumbnail(thumbnails.get("high").get("url").asText());
                            } else if (thumbnails.has("medium")) {
                                video.setThumbnail(thumbnails.get("medium").get("url").asText());
                            } else if (thumbnails.has("default")) {
                                video.setThumbnail(thumbnails.get("default").get("url").asText());
                            }
                        }
                    }

                    videos.add(video);
                }
            }
        } catch (Exception e) {
            System.err.println("Error parsing YouTube response: " + e.getMessage());
        }

        SearchResponse searchResponse = new SearchResponse(videos, query, totalResults);
        searchResponse.setNextPageToken(nextPageToken);
        return searchResponse;
    }

    private String getTextValue(JsonNode node, String field) {
        if (node.has(field) && !node.get(field).isNull()) {
            return node.get(field).asText();
        }
        return null;
    }

    private String formatDate(String isoDate) {
        try {
            LocalDateTime dateTime = LocalDateTime.parse(isoDate.replace("Z", ""));
            return dateTime.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
        } catch (Exception e) {
            return isoDate;
        }
    }

    private SearchResponse getDemoResults(String query, int maxResults) {
        List<Video> videos = new ArrayList<>();
        String[] channels = {"TechMaster", "LearnHub", "ProTutorials", "SkillForge", 
                           "MasterClass", "ExpertGuide", "QuickLearn", "DeepDive"};
        String[] adjectives = {"Complete", "Ultimate", "Beginner's", "Advanced", 
                              "Professional", "Quick", "In-Depth", "Essential"};

        for (int i = 0; i < maxResults; i++) {
            Video video = new Video();
            video.setId("demo-" + i + "-" + System.currentTimeMillis());
            video.setTitle(adjectives[i % adjectives.length] + " " + query + " Tutorial - Part " + (i + 1));
            video.setThumbnail("https://picsum.photos/seed/" + query.hashCode() + i + "/480/270");
            video.setChannel(channels[i % channels.length]);
            video.setDescription("Learn everything about " + query + " in this comprehensive video tutorial. " +
                    "Perfect for beginners and intermediate learners alike.");
            video.setPublishedAt(getRandomDate());
            videos.add(video);
        }

        return new SearchResponse(videos, query, videos.size());
    }

    private String getRandomDate() {
        int daysAgo = (int) (Math.random() * 365);
        LocalDateTime date = LocalDateTime.now().minusDays(daysAgo);
        return date.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
    }
}
