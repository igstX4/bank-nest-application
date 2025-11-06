# Insomnia API Requests

## Base URL
```
http://localhost:4000
```

## Environment Variables (Create in Insomnia)
- `base_url`: `http://localhost:4000`
- `token`: (будет заполняться после логина)

---

## 1. Authentication

### POST /auth/register
**Create new user**

```json
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "email": "user1@example.com",
  "password": "password123"
}
```

### POST /auth/login
**Login user**

```json
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "user1@example.com",
  "password": "password123"
}
```

**Response:** 
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Сохраните token в переменную окружения `token`**

### GET /auth/me
**Get current user info**

```json
GET {{base_url}}/auth/me
Authorization: Bearer {{token}}
```

---

## 2. Accounts

### GET /accounts
**List user's accounts**

```json
GET {{base_url}}/accounts
Authorization: Bearer {{token}}
```

### GET /accounts/:id/balance
**Get specific account balance**

```json
GET {{base_url}}/accounts/1/balance
Authorization: Bearer {{token}}
```

---

## 3. Transactions

### POST /transactions/transfer
**Transfer between users (same currency)**

```json
POST {{base_url}}/transactions/transfer
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "recipientEmail": "user2@example.com",
  "currency": "USD",
  "amount": 50.50
}
```

### POST /transactions/exchange
**Currency exchange within user's accounts**

```json
POST {{base_url}}/transactions/exchange
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "fromCurrency": "USD",
  "amount": 100.00
}
```

**Exchange EUR to USD:**
```json
POST {{base_url}}/transactions/exchange
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "fromCurrency": "EUR",
  "amount": 92.00
}
```

### GET /transactions
**List transactions with filters**

**All transactions:**
```json
GET {{base_url}}/transactions?page=1&limit=20
Authorization: Bearer {{token}}
```

**Filter by type:**
```json
GET {{base_url}}/transactions?type=transfer&page=1&limit=20
Authorization: Bearer {{token}}
```

```json
GET {{base_url}}/transactions?type=exchange&page=1&limit=20
Authorization: Bearer {{token}}
```

---

## Test Scenario

### Setup:
1. **Register User 1:**
   ```json
   POST /auth/register
   {
     "email": "alice@example.com",
     "password": "password123"
   }
   ```
   Сохраните token как `token_user1`

2. **Register User 2:**
   ```json
   POST /auth/register
   {
     "email": "bob@example.com",
     "password": "password123"
   }
   ```
   Сохраните token как `token_user2`

### Test Flow:

1. **Check User 1 accounts:**
   ```
   GET /accounts (Authorization: Bearer {{token_user1}})
   ```
   Должны быть: USD $1000.00, EUR €500.00

2. **Transfer from User 1 to User 2:**
   ```
   POST /transactions/transfer (Authorization: Bearer {{token_user1}})
   {
     "recipientEmail": "bob@example.com",
     "currency": "USD",
     "amount": 50.00
   }
   ```

3. **Check User 2 accounts:**
   ```
   GET /accounts (Authorization: Bearer {{token_user2}})
   ```
   USD должен быть $1050.00

4. **Exchange USD to EUR (User 1):**
   ```
   POST /transactions/exchange (Authorization: Bearer {{token_user1}})
   {
     "fromCurrency": "USD",
     "amount": 100.00
   }
   ```
   Конвертирует 100 USD в 92 EUR

5. **View transaction history:**
   ```
   GET /transactions?type=transfer (Authorization: Bearer {{token_user1}})
   GET /transactions?type=exchange (Authorization: Bearer {{token_user1}})
   GET /transactions?page=1&limit=10 (Authorization: Bearer {{token_user1}})
   ```

---

## Error Cases to Test:

### Insufficient Funds:
```json
POST /transactions/transfer
{
  "recipientEmail": "bob@example.com",
  "currency": "USD",
  "amount": 10000.00
}
```

### Invalid Recipient:
```json
POST /transactions/transfer
{
  "recipientEmail": "nonexistent@example.com",
  "currency": "USD",
  "amount": 50.00
}
```

### Same Currency Exchange:
```json
POST /transactions/exchange
{
  "fromCurrency": "USD",
  "amount": 100.00
}
```
(Это должно работать, т.к. мы автоматически определяем toCurrency)

