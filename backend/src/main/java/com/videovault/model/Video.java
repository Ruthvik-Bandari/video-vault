package com.videovault.model;

public class Video {
    private String id;
    private String title;
    private String thumbnail;
    private String channel;
    private String description;
    private String publishedAt;
    private String duration;
    private String viewCount;

    public Video() {}

    public Video(String id, String title, String thumbnail, String channel, 
                 String description, String publishedAt) {
        this.id = id;
        this.title = title;
        this.thumbnail = thumbnail;
        this.channel = channel;
        this.description = description;
        this.publishedAt = publishedAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getViewCount() {
        return viewCount;
    }

    public void setViewCount(String viewCount) {
        this.viewCount = viewCount;
    }
}
