# Shop-app-template
A template for a shop app implemented with react native and firebase

<b>Set up</b></br>
</br>
<b>Firebase</b></br>
Start a firebase project</br>
Create a realtime database</br>
In authentication choose registration with email/password</br>
Set the following rules
```
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

<b>Project folder</b></br>
In the project folder</br>
create a env.js
```
const vars = {
    firebaseURL: 'YOUR_FIREBASE_DB_URL',
    GoogleKey: 'YOUR_GOOGLE_API_KEY_TO_USE_THE_SIGNUP_API'
};
export default vars;
```

<b>Features</b></br>
Login/Signup with email/password</br>
Logout</br>
Autologin/autologout</br>
View products</br>
View products details</br>
Add product to cart</br>
Remove product from cart</br>
Checkout</br>
See orders list</br>
Remove order</br>
Add products</br>
Edit added product</br>
