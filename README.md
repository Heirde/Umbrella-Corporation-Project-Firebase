# Umbrella-Corporation-Project
This is a little project of mine that I had been debating to do for a while. This is due to the fact that I absolutely love and adore the Resident Evil series and I really wanted to use my website development skills for a project like this.

## Server environment variables
Create a `.env` file inside the `server` folder with these values:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
MONGODB_URI=your-mongodb-connection-string
PORT=3001
```

For Gmail, use an app password if 2FA is enabled. The server sends reset emails through Gmail SMTP.
