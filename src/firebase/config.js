import Firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyA1FQuExa-UQarWkTwAKgllgY51VEw1RDM",
    databaseURL: "https://mychat-7f3cc-default-rtdb.firebaseio.com/",
    projectId: "mychat-7f3cc",
    appId: "1:733444797034:web:bacd19b09c778f90379013",
  };
  
  export default Firebase.initializeApp(firebaseConfig);