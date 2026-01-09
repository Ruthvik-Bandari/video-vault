package com.videovault.controller;

import com.videovault.model.SearchResponse;
import com.videovault.service.YouTubeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class VideoController {

    private final YouTubeService youTubeService;

    @Autowired
    public VideoController(YouTubeService youTubeService) {
        this.youTubeService = youTubeService;
    }

    /**
     * Search videos by query/category
     * 
     * @param query The search query or category
     * @param maxResults Maximum number of results (default 12)
     * @param pageToken Token for pagination
     * @return SearchResponse containing list of videos
     */
    @GetMapping("/search")
    public ResponseEntity<SearchResponse> searchVideos(
            @RequestParam String query,
            @RequestParam(defaultValue = "12") int maxResults,
            @RequestParam(required = false) String pageToken) {
        
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Limit max results to prevent abuse
        maxResults = Math.min(maxResults, 50);

        SearchResponse response = youTubeService.searchVideos(query.trim(), maxResults, pageToken);
        return ResponseEntity.ok(response);
    }

    /**
     * Get popular/suggested categories
     * 
     * @return List of category names
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = Arrays.asList(
            "Technology", "Music", "Gaming", "Education",
            "Cooking", "Fitness", "Travel", "Science",
            "Programming", "Business", "Art", "Photography"
        );
        return ResponseEntity.ok(categories);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Video Vault API is running!");
    }
}
