# backend-repo

## Installation Steps

1. clone https://github.com/hektahendrapriana/backend-repo.git
2. Go to backend-repo folder
```
cd backend-repo/functions
npm i
npm run serve
```

3. List of ENDPOINT :
  - v1/users (POST with No Authorization)
  - v1/users (GET with Authorization)
  - v1/users/:id (GET by ID with Authorization)
  - v1/users/:id (UPDATE/PUT by ID with Authorization)
  - v1/users/changepassword/:id (PUT by ID with Authorization)
  - v1/users/:id (DELETE by ID with Authorization)
  - v1/login (POST to get token)
  - v1/refresh-token (POST)

4. Testing CURL :
```
curl --location 'http://127.0.0.1:5001/ebuddy-3e6bb/us-central1/api/v1/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "displayName": "Hekta Hendra Priana",
    "email": "hektahendrapriana@gmail.com",
    "phone": "+6287819337560",
    "password": "Test1234!"
}'
```

```
curl --location 'http://127.0.0.1:5001/ebuddy-3e6bb/us-central1/api/v1/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "hektahendrapriana@gmail.com",
    "password": "Test1234!"
}'
```

```
curl --location --request POST 'http://127.0.0.1:5001/ebuddy-3e6bb/us-central1/api/v1/refresh-token' \
--header 'Authorization: Bearer 99b05e02672891c65a7b5bb772624847d65b9e6ad15c972b2f24db81f54b47ebc0638899c0b4f1f441bda1d7e126c54b15e025c02c3906163f57094dc6ec85958d6063bf99e7fad91802d8e918b38bd0a174b7a63ded7c7d1bb12583cb712e1d339e27d148b4227412f476bc744620d968ae43f805228f224cd2dc52be2b5ce217b218b44abe3670d4c3e668272ad1066356e0bffa2e05e8d3d5f064a2a0862f78c6f345dbbec5434d02053a8c89372cd07a7d88fc0d89a75ba259b1863ae1e63157fb5616080d6476e646bd2c0c4da75bd675ae7b7082ac54e794bd2a76bf5d01f3015c24d5820871b85332e527f3d31d37a54e9f1dcda0a023ebc57d597ad65063bff000dd3e285cab0de9382cf81ef3afdd32629d2d12725a34a8e9a69c15f8e8c580676c3bef59e5e486e22f3c5f6674a99729b438b030e4d045e7d8333524a06a6d7f0bd1fd56cacbc4e3a28a3b87db566ba9f9cacebe6e783f18af7440'
```

```
curl --location 'http://127.0.0.1:5001/ebuddy-3e6bb/us-central1/api/v1/users' \
--header 'Authorization: Bearer 99b05e02672891c65a7b5bb772624847d65b9e6ad15c972b2f24db81f54b47ebc0638899c0b4f1f441bda1d7e126c54b131328bc860c168e0822d8de0385adb1c5e075ccb8ad8b29b5b460082be70d9f1916d1b9ee4a1055f45d93f04a72255825e61bc64adf84831ab0e273a4d70c0ff0083399097b61f270cd4e5da1f275e4fad172e68ba3a4c1462a24ddfc36eb1bdca3f1fd0fc3c7a5a14e1d53f16f0e76cc02aefbb77442034fdc40abce9cb0d10979d0091df550810e40090aa444fcf87f5ec5532f618d13b895a63339894f1c2c1d9a906d0b5832c09ae12dd8475c9656951d94269feefd013e7e57d6a919e7a248853e5b5f5b2bbe13815cba8e521758381167b88f9875a3281568b589e5fe1660ea85aab2cb9eb3d05f352a8e27b772c7e1f8ffe56b5732f55c0c4cd28bfccd9a5003c281568b0ccef2806b1c50a429ca373a1c4c955967fc607902f48887681f1bae8de4e341d4274ed2d40748db'
```

```
curl --location --request PUT 'http://127.0.0.1:5001/ebuddy-3e6bb/us-central1/api/v1/users/changepassword/302ae694-759a-4c57-ac5f-448d7c303426' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 99b05e02672891c65a7b5bb772624847d65b9e6ad15c972b2f24db81f54b47ebc0638899c0b4f1f441bda1d7e126c54be45289d170be04d0c5c23e22fdcda5b4857c2525fa4afad203861f1a123973ee1cdbd2ad887744975ae236b802bc935ebb564b36ac4da6081f4a58cf059c8ea6721ce3f01b9c1a91d3f707869c94c0440d11dab48378396a35d0f8512229debe336622589601c5f2507930f50b3077fa1997cadfb8c0c5949346b6624254b24eda8315b3967974e6c784fda675c9b533e7d67ddd74e0508b6328d8b21115b565fdbca45842e4729eb6e73c7a9df7602bb7e462c9c29d69aa0da1a96230efb9405b1f79b6845ab088f4abc2486b5c9f57d51d6b71d5fa82ff8fadf91f6c5d072246ab2eed1fe3c36ab34adfa7fa56ef55e33982d9af3566dec30f8cc1d3d6fc2e9e91fd76cb78627b29068234fd3457817b422cadc99c584d90df774315632712feb5a047fbfcdcf232ff4702adc18d97' \
--data-raw '{
    "password": "Radio1234!"
}'
```

```
curl --location --request DELETE 'http://127.0.0.1:5001/ebuddy-3e6bb/us-central1/api/v1/users/3fcd3a69-7275-4568-b4e6-529e678e587f' \
--header 'Authorization: Bearer 99b05e02672891c65a7b5bb772624847d65b9e6ad15c972b2f24db81f54b47ebc0638899c0b4f1f441bda1d7e126c54b131328bc860c168e0822d8de0385adb1c5e075ccb8ad8b29b5b460082be70d9f1916d1b9ee4a1055f45d93f04a72255825e61bc64adf84831ab0e273a4d70c0ff0083399097b61f270cd4e5da1f275e4fad172e68ba3a4c1462a24ddfc36eb1bdca3f1fd0fc3c7a5a14e1d53f16f0e76cc02aefbb77442034fdc40abce9cb0d10979d0091df550810e40090aa444fcf87f5ec5532f618d13b895a63339894f1c2c1d9a906d0b5832c09ae12dd8475c9656951d94269feefd013e7e57d6a919e7a248853e5b5f5b2bbe13815cba8e521758381167b88f9875a3281568b589e5fe1660ea85aab2cb9eb3d05f352a8e27b772c7e1f8ffe56b5732f55c0c4cd28bfccd9a5003c281568b0ccef2806b1c50a429ca373a1c4c955967fc607902f48887681f1bae8de4e341d4274ed2d40748db'
```

```
curl --location 'http://127.0.0.1:5001/ebuddy-3e6bb/us-central1/api/v1/users/c3c805d3-a3f8-4a5a-ae23-7771d9d03268' \
--header 'Authorization: Bearer 99b05e02672891c65a7b5bb772624847d65b9e6ad15c972b2f24db81f54b47ebc0638899c0b4f1f441bda1d7e126c54b131328bc860c168e0822d8de0385adb1c5e075ccb8ad8b29b5b460082be70d9f1916d1b9ee4a1055f45d93f04a72255825e61bc64adf84831ab0e273a4d70c0ff0083399097b61f270cd4e5da1f275e4fad172e68ba3a4c1462a24ddfc36eb1bdca3f1fd0fc3c7a5a14e1d53f16f0e76cc02aefbb77442034fdc40abce9cb0d10979d0091df550810e40090aa444fcf87f5ec5532f618d13b895a63339894f1c2c1d9a906d0b5832c09ae12dd8475c9656951d94269feefd013e7e57d6a919e7a248853e5b5f5b2bbe13815cba8e521758381167b88f9875a3281568b589e5fe1660ea85aab2cb9eb3d05f352a8e27b772c7e1f8ffe56b5732f55c0c4cd28bfccd9a5003c281568b0ccef2806b1c50a429ca373a1c4c955967fc607902f48887681f1bae8de4e341d4274ed2d40748db'
```



   
