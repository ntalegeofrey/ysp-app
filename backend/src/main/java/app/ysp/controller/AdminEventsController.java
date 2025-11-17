package app.ysp.controller;

import app.ysp.service.SseHub;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/admin/events")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEventsController {
    private final SseHub hub;

    public AdminEventsController(SseHub hub) {
        this.hub = hub;
    }

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        // 30 minutes timeout per connection
        SseEmitter emitter = hub.subscribe(30L * 60 * 1000);
        return emitter;
    }
}
