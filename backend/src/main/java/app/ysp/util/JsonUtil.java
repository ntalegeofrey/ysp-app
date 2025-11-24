package app.ysp.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Utility class for JSON serialization and deserialization.
 * Use this for storing/retrieving JSON data in TEXT database columns.
 * 
 * Usage:
 * - Saving: String json = JsonUtil.serialize(myObject);
 * - Loading: MyObject obj = JsonUtil.deserialize(json, MyObject.class);
 * - Loading Map: Map<String, Object> map = JsonUtil.toMap(json);
 * - Loading List: List<Map<String, Object>> list = JsonUtil.toList(json);
 */
@Component
public class JsonUtil {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Serialize any object to JSON string
     * @param object The object to serialize
     * @return JSON string, or null if serialization fails
     */
    public static String serialize(Object object) {
        if (object == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize object to JSON: " + e.getMessage(), e);
        }
    }
    
    /**
     * Deserialize JSON string to a specific class
     * @param json The JSON string
     * @param targetClass The target class type
     * @return Deserialized object, or null if json is null
     */
    public static <T> T deserialize(String json, Class<T> targetClass) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, targetClass);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize JSON to " + targetClass.getName() + ": " + e.getMessage(), e);
        }
    }
    
    /**
     * Deserialize JSON string to a Map<String, Object>
     * @param json The JSON string
     * @return Map representation of JSON, or null if json is null
     */
    public static Map<String, Object> toMap(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize JSON to Map: " + e.getMessage(), e);
        }
    }
    
    /**
     * Deserialize JSON string to a List<Map<String, Object>>
     * @param json The JSON string
     * @return List of Maps, or null if json is null
     */
    public static List<Map<String, Object>> toList(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize JSON to List: " + e.getMessage(), e);
        }
    }
    
    /**
     * Deserialize JSON string using custom TypeReference
     * Useful for complex generic types like List<MyClass>
     * 
     * Example: List<MyClass> list = JsonUtil.deserialize(json, new TypeReference<List<MyClass>>() {});
     * 
     * @param json The JSON string
     * @param typeReference The TypeReference for the target type
     * @return Deserialized object, or null if json is null
     */
    public static <T> T deserialize(String json, TypeReference<T> typeReference) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, typeReference);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize JSON: " + e.getMessage(), e);
        }
    }
    
    /**
     * Check if a string is valid JSON
     * @param json The string to check
     * @return true if valid JSON, false otherwise
     */
    public static boolean isValidJson(String json) {
        if (json == null || json.isEmpty()) {
            return false;
        }
        try {
            objectMapper.readTree(json);
            return true;
        } catch (JsonProcessingException e) {
            return false;
        }
    }
}
