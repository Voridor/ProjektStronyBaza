# Odbudowa bazy danych za pomocą `mongorestore`

## Wymagania
- Zainstalowane **MongoDB Tools** (zawierające `mongorestore`).
- Kopia zapasowa bazy danych utworzona za pomocą `mongodump`.

## Instrukcja

1. **Uruchom serwer MongoDB**  
   Upewnij się, że MongoDB działa (domyślnie na `localhost:27017`).

2. **Wypakuj kopię zapasową**  
   Rozpakuj kopię zapasową bazy danych.

2. **Wykonaj polecenie `mongorestore`**  
   Przywrócenie całej bazy danych:
   ```bash
   mongorestore bookstore