# Use Cases

The API has 25 use cases. Each use case lives in one folder under
`src/application/use-cases/{domain}/{action}-{entity}/`.

## Use Case Catalog

| ID | Use Case | Method | Endpoint |
|----|----------|--------|----------|
| UC-BUS-001 | Create Bus | POST | `/buses` |
| UC-BUS-002 | Get Bus | GET | `/buses/:id` |
| UC-BUS-003 | List Buses | GET | `/buses` |
| UC-BUS-004 | Update Bus | PUT | `/buses/:id` |
| UC-BUS-005 | Delete Bus | DELETE | `/buses/:id` |
| UC-ENT-001 | Create Enterprise | POST | `/enterprises` |
| UC-ENT-002 | Get Enterprise | GET | `/enterprises/:id` |
| UC-ENT-003 | List Enterprises | GET | `/enterprises` |
| UC-ENT-004 | Update Enterprise | PUT | `/enterprises/:id` |
| UC-ENT-005 | Delete Enterprise | DELETE | `/enterprises/:id` |
| UC-ROU-001 | Create Route | POST | `/routes` |
| UC-ROU-002 | Get Route | GET | `/routes/:id` |
| UC-ROU-003 | List Routes | GET | `/routes` |
| UC-ROU-004 | Update Route | PUT | `/routes/:id` |
| UC-ROU-005 | Delete Route | DELETE | `/routes/:id` |
| UC-TRI-001 | Create Trip | POST | `/trips` |
| UC-TRI-002 | Get Trip | GET | `/trips/:id` |
| UC-TRI-003 | List Trips | GET | `/trips` |
| UC-TRI-004 | Update Trip | PUT | `/trips/:id` |
| UC-TRI-005 | Delete Trip | DELETE | `/trips/:id` |
| UC-USR-001 | Create User | POST | `/users` |
| UC-USR-002 | Get User | GET | `/users/:id` |
| UC-USR-003 | List Users | GET | `/users` |
| UC-USR-004 | Update User | PUT | `/users/:id` |
| UC-USR-005 | Delete User | DELETE | `/users/:id` |

## Shared Rules

These rules apply to every use case in this document.

- A create operation returns 201. A read or update operation returns 200.
- A delete operation returns 204 and has no response body.
- If the entity does not exist, the operation returns 404.
- If a request field fails validation, the operation returns 400.
- A missing foreign key target returns 404 before any business rule runs.
  The FK check always comes first.
- Every list operation accepts `limit` and `offset` query parameters.
  `limit` has a default of 10 and a maximum of 100. `offset` has a default of 0.
- Every list response contains the collection, `total`, `limit`, and `offset`.
- An update operation changes only the fields present in the request body.
  The operation bumps `updatedAt` when it changes data.
- A `Bus` references an `Enterprise` through `enterpriseId`.
- An `Enterprise` references a `User` through `ownerId`.
- A `Trip` references a `Route` through `routeId`.
- A `Route` has no foreign key.

---

## Buses

### UC-BUS-001: Create Bus

**Summary**: Creates a new bus for an enterprise.

### Request DTO

```typescript
export class CreateBusRequestDto {
    @IsString()
    @IsNotEmpty()
    model: string;

    @IsUUID()
    enterpriseId: string;
}
```

### Business Rules

- The `enterpriseId` must reference an existing enterprise
- The enterprise check runs before all other rules

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Enterprise not found | `NotFoundException` (404) |
| Invalid input | `BadRequestException` (400) |

---

### UC-BUS-002: Get Bus

**Summary**: Returns one bus by its ID.

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Bus not found | `NotFoundException` (404) |

---

### UC-BUS-003: List Buses

**Summary**: Returns a paginated list of buses.

### Response DTO

```typescript
export class ListBusesResponseDto extends PaginationResponseDto {
    buses: BusResponseDto[];
}
```

---

### UC-BUS-004: Update Bus

**Summary**: Changes mutable fields of an existing bus. Only fields present in the request body change.

### Request DTO

```typescript
export class UpdateBusRequestDto {
    @IsString()
    @IsOptional()
    model?: string;

    @IsUUID()
    @IsOptional()
    enterpriseId?: string;
}
```

### Business Rules

- If the request contains `enterpriseId`, the referenced enterprise must exist
- Only fields present in the request body are updated

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Bus not found | `NotFoundException` (404) |
| Enterprise not found | `NotFoundException` (404) |
| Invalid input | `BadRequestException` (400) |

---

### UC-BUS-005: Delete Bus

**Summary**: Removes a bus from the system permanently.

### Business Rules

- Returns 404 if the bus does not exist
- Returns 204 No Content on success

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Bus not found | `NotFoundException` (404) |

---

## Enterprises

### UC-ENT-001: Create Enterprise

**Summary**: Creates a new enterprise for a user.

### Request DTO

```typescript
export class CreateEnterpriseRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    legalId: string;

    @IsUUID()
    ownerId: string;
}
```

### Business Rules

- The `ownerId` must reference an existing user
- The `legalId` must be unique across all enterprises
- The owner check runs before the legal ID uniqueness check

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Owner user not found | `NotFoundException` (404) |
| Legal ID already exists | `BadRequestException` (400) |
| Invalid input | `BadRequestException` (400) |

---

### UC-ENT-002: Get Enterprise

**Summary**: Returns one enterprise by its ID.

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Enterprise not found | `NotFoundException` (404) |

---

### UC-ENT-003: List Enterprises

**Summary**: Returns a paginated list of enterprises.

### Response DTO

```typescript
export class ListEnterprisesResponseDto extends PaginationResponseDto {
    enterprises: EnterpriseResponseDto[];
}
```

---

### UC-ENT-004: Update Enterprise

**Summary**: Changes mutable fields of an existing enterprise. Only fields present in the request body change.

### Request DTO

```typescript
export class UpdateEnterpriseRequestDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsUUID()
    @IsOptional()
    ownerId?: string;
}
```

### Business Rules

- `legalId` cannot change. The field is immutable
- If the request contains `ownerId`, the referenced user must exist
- Only fields present in the request body are updated

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Enterprise not found | `NotFoundException` (404) |
| Owner user not found | `NotFoundException` (404) |
| Invalid input | `BadRequestException` (400) |

---

### UC-ENT-005: Delete Enterprise

**Summary**: Removes an enterprise from the system permanently.

### Business Rules

- Returns 404 if the enterprise does not exist
- Returns 204 No Content on success

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Enterprise not found | `NotFoundException` (404) |

---

## Routes

### UC-ROU-001: Create Route

**Summary**: Creates a new route with a name, an origin, and a destination.

### Request DTO

```typescript
export class CreateRouteRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    origin: string;

    @IsString()
    @IsNotEmpty()
    destination: string;
}
```

### Business Rules

- A route has no foreign key and no uniqueness rule

---

### UC-ROU-002: Get Route

**Summary**: Returns one route by its ID.

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Route not found | `NotFoundException` (404) |

---

### UC-ROU-003: List Routes

**Summary**: Returns a paginated list of routes.

### Response DTO

```typescript
export class ListRoutesResponseDto extends PaginationResponseDto {
    routes: RouteResponseDto[];
}
```

---

### UC-ROU-004: Update Route

**Summary**: Changes mutable fields of an existing route. Only fields present in the request body change.

### Request DTO

```typescript
export class UpdateRouteRequestDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    origin?: string;

    @IsString()
    @IsOptional()
    destination?: string;
}
```

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Route not found | `NotFoundException` (404) |
| Invalid input | `BadRequestException` (400) |

---

### UC-ROU-005: Delete Route

**Summary**: Removes a route from the system permanently.

### Business Rules

- Returns 404 if the route does not exist
- Returns 204 No Content on success

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Route not found | `NotFoundException` (404) |

---

## Trips

### UC-TRI-001: Create Trip

**Summary**: Creates a new trip on a route.

### Request DTO

```typescript
export class CreateTripRequestDto {
    @IsDateString()
    departureAt: string;

    @IsUUID()
    routeId: string;
}
```

### Business Rules

- The `routeId` must reference an existing route
- The use case converts `departureAt` to a `Date`
- The route check runs before all other rules

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Route not found | `NotFoundException` (404) |
| Invalid input | `BadRequestException` (400) |

---

### UC-TRI-002: Get Trip

**Summary**: Returns one trip by its ID.

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Trip not found | `NotFoundException` (404) |

---

### UC-TRI-003: List Trips

**Summary**: Returns a paginated list of trips.

### Response DTO

```typescript
export class ListTripsResponseDto extends PaginationResponseDto {
    trips: TripResponseDto[];
}
```

---

### UC-TRI-004: Update Trip

**Summary**: Changes mutable fields of an existing trip. Only fields present in the request body change.

### Request DTO

```typescript
export class UpdateTripRequestDto {
    @IsDateString()
    @IsOptional()
    departureAt?: string;

    @IsUUID()
    @IsOptional()
    routeId?: string;
}
```

### Business Rules

- If the request contains `routeId`, the referenced route must exist
- The use case converts `departureAt` to a `Date`

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Trip not found | `NotFoundException` (404) |
| Route not found | `NotFoundException` (404) |
| Invalid input | `BadRequestException` (400) |

---

### UC-TRI-005: Delete Trip

**Summary**: Removes a trip from the system permanently.

### Business Rules

- Returns 404 if the trip does not exist
- Returns 204 No Content on success

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Trip not found | `NotFoundException` (404) |

---

## Users

### UC-USR-001: Create User

**Summary**: Creates a new user with a name, an email, and a role.

### Request DTO

```typescript
export class CreateUserRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsIn(USER_ROLES)
    role: string;
}
```

### Business Rules

- The `email` must be unique across all users
- The `role` must be one of `USER_ROLES`: `admin`, `driver`, or `user`

### Error Cases

| Condition | Exception |
|-----------|-----------|
| Email already exists | `BadRequestException` (400) |
| Invalid input | `BadRequestException` (400) |

---

### UC-USR-002: Get User

**Summary**: Returns one user by its ID.

### Error Cases

| Condition | Exception |
|-----------|-----------|
| User not found | `NotFoundException` (404) |

---

### UC-USR-003: List Users

**Summary**: Returns a paginated list of users.

### Response DTO

```typescript
export class ListUsersResponseDto extends PaginationResponseDto {
    users: UserResponseDto[];
}
```

---

### UC-USR-004: Update User

**Summary**: Changes mutable fields of an existing user. Only fields present in the request body change.

### Request DTO

```typescript
export class UpdateUserRequestDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsIn(USER_ROLES)
    @IsOptional()
    role?: string;
}
```

### Business Rules

- The email uniqueness check runs only when the new email differs from the current email
- Only fields present in the request body are updated

### Error Cases

| Condition | Exception |
|-----------|-----------|
| User not found | `NotFoundException` (404) |
| Email already exists | `BadRequestException` (400) |
| Invalid input | `BadRequestException` (400) |

---

### UC-USR-005: Delete User

**Summary**: Removes a user from the system permanently.

### Business Rules

- Returns 404 if the user does not exist
- Returns 204 No Content on success

### Error Cases

| Condition | Exception |
|-----------|-----------|
| User not found | `NotFoundException` (404) |