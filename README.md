
# Artetore ImageHub

Frontend For Showing Different Arts And Design


## Backend
Setup the backend first to run the frontend properly
[Artetore Backend API](https://github.com/DeepProgram/artetoreAPI)
## Environment Variables

To run this project, you will need to add the following environment variables to your **.env.local**  file

`NEXT_PUBLIC_SERVER_HOST`



## Deployment

To deploy this project on development server

```bash
  npm install
  npm run dev
```
To deploy this project on production server

```bash
  npm install
  npm run build
  npm run start
```


## Demo

Home Page

![App Screenshot](https://raw.githubusercontent.com/DeepProgram/artetore/screenshot/gif/home_page.gif)

Admin Login Page **[Admin Only]**

![App Screenshot](https://raw.githubusercontent.com/DeepProgram/artetore/screenshot/gif/admin_login.gif)

Admin Operations **[Admin Only]**

![App Screenshot](https://raw.githubusercontent.com/DeepProgram/artetore/screenshot/gif/admin_operation.gif)

Update/Add Image **[Admin Only]**

![App Screenshot](https://raw.githubusercontent.com/DeepProgram/artetore/screenshot/gif/update_image.gif)

Delete Image **[Admin Only]**

![App Screenshot](https://raw.githubusercontent.com/DeepProgram/artetore/screenshot/gif/delete_image.gif)
## Features
-
    ### Home Page
    - Dot Loader starts animation on refresh or changing page
    - 4x4 grid image box
    - Clicking home page image box will activate a loader with backdrop and open a new page component
    - Detailed image page shows a big image and can be fetched another image from the same group by selecting image from the vertical slider
    - Request to download button is available and on clicking that button a full res image will be fetched from backend
    - On clicking Download Now the full res image will be downloaded
    - On top right the close button is placed and on clicking that button the high res image window will be closed

-
    ### Admin Login
    - Both username and password input type is set to password for security purpose
    - On entering wrong username and password a notification will be shown on top right corner
    - On entering valid username and password the login page will be redirected to a new page
    - **Currently There Is No Feature To Chaange Username And Password**

-
    ### Onedrive Operation
    - Connect onedrive option will connect a static onedrive account **[Setup On Backend]**
    - Refresh folder will fetch all the folders from the specified onedrive folder **[Setup On Backend]**
    - New Folder button will open a modal with input field and on clicking submit the folder will be created on onedrive through backend
    - Upload File option is only available when inside a folder and on clicking that button a modal will be opned for upload multiple file or single file and on clicking on submit the fies will be uploaded to onedrive one by one
    - Rename option is available for both file and folder and on clicking that a modal will be opned with previous nmae and a input field for entering current naame
    - Properties option is also available for both file and folder and on clicking that button a brief info about that file or folder will be shown

-
    ### Add / Update Image
    - File tree is shown and a whole folder or single file from onedrive can be selected to add in a new group **[New Grid Will Be Created]** or any existing group 
    - On top right a cat icon is added and whenever a image is selected to be added the cat icon will be active and clickable. On clicking it a modal will be opned with the selected image info and confirmation to send that info on backend
    - Send button on the modal will send the data to backend and will be added to database and will show notification acording to backend response

-
    ### Delete Image
    - Group Tree **[Grid List]** is shown and on expanding is group will show the image name and info about added from which folder
    - Group Image section is for showing the image before deleting. Both individual image and group first image can be shown to avoid accidental deletion
    - On selecting a image for deltetion or whole group the cat icon will be active and clickable and on clicking that cat icon a modal will be opened with image info and confirmation to delete those image
    - On clicking send button the info will be send to backend to delete those image from database
