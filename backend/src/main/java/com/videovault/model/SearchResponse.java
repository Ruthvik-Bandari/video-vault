package com.videovault.model;

import java.util.List;

public class SearchResponse {
    private List<Video> videos;
    private String query;
    private int totalResults;
    private String nextPageToken;

    public SearchResponse() {}

    public SearchResponse(List<Video> videos, String query, int totalResults) {
        this.videos = videos;
        this.query = query;
        this.totalResults = totalResults;
    }

    // Getters and Setters
    public List<Video> getVideos() {
        return videos;
    }

    public void setVideos(List<Video> videos) {
        this.videos = videos;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public int getTotalResults() {
        return totalResults;
    }

    public void setTotalResults(int totalResults) {
        this.totalResults = totalResults;
    }

    public String getNextPageToken() {
        return nextPageToken;
    }

    public void setNextPageToken(String nextPageToken) {
        this.nextPageToken = nextPageToken;
    }
}
