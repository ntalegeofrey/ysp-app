# JSON Storage Guide - Using JsonUtil

## Overview
When storing JSON data in TEXT database columns, always use the `JsonUtil` class for consistent serialization and deserialization.

---

## Database Schema Pattern

Always use `TEXT` columns for JSON data:

```sql
CREATE TABLE my_table (
    id BIGSERIAL PRIMARY KEY,
    data_json TEXT,  -- Store JSON as TEXT
    metadata_json TEXT
);
```

---

## Entity Pattern

```java
@Entity
@Table(name = "my_table")
public class MyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "data_json", columnDefinition = "TEXT")
    private String dataJson;  // Always String type
    
    @Column(name = "metadata_json", columnDefinition = "TEXT")
    private String metadataJson;
}
```

**Important:** 
- Use `columnDefinition = "TEXT"` (matches database)
- Field type is always `String`
- Never use `Map` or `Object` as field types

---

## Controller/Service Pattern

### Saving (Serialization)

```java
import app.ysp.util.JsonUtil;

@PostMapping("/create")
public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
    MyEntity entity = new MyEntity();
    
    // Serialize any object to JSON string
    entity.setDataJson(JsonUtil.serialize(body.get("data")));
    entity.setMetadataJson(JsonUtil.serialize(body.get("metadata")));
    
    repository.save(entity);
    return ResponseEntity.ok(entity);
}
```

### Loading (Deserialization)

```java
import app.ysp.util.JsonUtil;

@GetMapping("/{id}")
public ResponseEntity<?> get(@PathVariable Long id) {
    MyEntity entity = repository.findById(id).orElseThrow();
    
    // Deserialize to Map
    Map<String, Object> data = JsonUtil.toMap(entity.getDataJson());
    Map<String, Object> metadata = JsonUtil.toMap(entity.getMetadataJson());
    
    // Or deserialize to specific class
    MyDataClass data = JsonUtil.deserialize(entity.getDataJson(), MyDataClass.class);
    
    // Or deserialize to List
    List<Map<String, Object>> list = JsonUtil.toList(entity.getDataJson());
    
    Map<String, Object> response = Map.of(
        "id", entity.getId(),
        "data", data,
        "metadata", metadata
    );
    
    return ResponseEntity.ok(response);
}
```

---

## JsonUtil Methods Reference

### 1. `serialize(Object object)`
Converts any Java object to JSON string.

```java
String json = JsonUtil.serialize(myObject);
String json = JsonUtil.serialize(myMap);
String json = JsonUtil.serialize(myList);
```

### 2. `deserialize(String json, Class<T> targetClass)`
Converts JSON string to a specific Java class.

```java
MyClass obj = JsonUtil.deserialize(json, MyClass.class);
String str = JsonUtil.deserialize(json, String.class);
```

### 3. `toMap(String json)`
Converts JSON string to `Map<String, Object>`.

```java
Map<String, Object> map = JsonUtil.toMap(json);
// {"name": "John"} → {"name": "John"}
```

### 4. `toList(String json)`
Converts JSON array to `List<Map<String, Object>>`.

```java
List<Map<String, Object>> list = JsonUtil.toList(json);
// [{"id": 1}, {"id": 2}] → List of Maps
```

### 5. `deserialize(String json, TypeReference<T> typeReference)`
For complex generic types like `List<MyClass>`.

```java
List<MyClass> list = JsonUtil.deserialize(json, new TypeReference<List<MyClass>>() {});
Map<String, List<String>> map = JsonUtil.deserialize(json, new TypeReference<Map<String, List<String>>>() {});
```

### 6. `isValidJson(String json)`
Check if a string is valid JSON.

```java
boolean valid = JsonUtil.isValidJson(json);
```

---

## Complete Example: Fire Plan

### Entity
```java
@Entity
public class FirePlan {
    @Column(name = "staff_assignments_json", columnDefinition = "TEXT")
    private String staffAssignmentsJson;
    
    @Column(name = "route_config_json", columnDefinition = "TEXT")
    private String routeConfigJson;
}
```

### Controller - Saving
```java
@PatchMapping("/current")
public ResponseEntity<?> updatePlan(@RequestBody Map<String, Object> body) {
    FirePlan plan = new FirePlan();
    
    // Serialize
    plan.setStaffAssignmentsJson(JsonUtil.serialize(body.get("staffAssignments")));
    plan.setRouteConfigJson(JsonUtil.serialize(body.get("routeConfig")));
    
    repository.save(plan);
    return ResponseEntity.ok(plan);
}
```

### Controller - Loading
```java
@GetMapping("/current")
public ResponseEntity<?> getPlan() {
    FirePlan plan = repository.findActivePlan().orElseThrow();
    
    // Deserialize
    List<Map<String, Object>> staffAssignments = JsonUtil.toList(plan.getStaffAssignmentsJson());
    Map<String, Object> routeConfig = JsonUtil.toMap(plan.getRouteConfigJson());
    
    Map<String, Object> response = Map.of(
        "staffAssignments", staffAssignments,
        "routeConfig", routeConfig
    );
    
    return ResponseEntity.ok(response);
}
```

---

## Why This Approach?

✅ **Simple** - No external dependencies  
✅ **Consistent** - One utility for all JSON operations  
✅ **No schema conflicts** - TEXT matches TEXT  
✅ **Easy debugging** - Clear error messages  
✅ **Portable** - Works with any PostgreSQL version  

---

## Instructions

When creating new features that need to store JSON data:

1. **Database:** Use `TEXT` columns
2. **Entity:** Use `@Column(columnDefinition = "TEXT")` with `String` fields
3. **Controller/Service:** Import `app.ysp.util.JsonUtil`
4. **Saving:** `JsonUtil.serialize(object)`
5. **Loading:** `JsonUtil.toMap()`, `JsonUtil.toList()`, or `JsonUtil.deserialize()`

Never use JSONB without custom type handlers. Always use this pattern!
