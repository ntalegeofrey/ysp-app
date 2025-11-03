# Use official nginx base image
FROM nginx:alpine

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom config into container
COPY default.conf /etc/nginx/conf.d/

# Expose web ports
EXPOSE 80
EXPOSE 443

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
