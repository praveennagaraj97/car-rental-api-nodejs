# EXPLORE DREAM AND DISCOVER

![Required Node version](https://img.shields.io/node/v/hexo)

> A fast and simple Project, powered by [Node.js](https://nodejs.org).
> ![alt text](https://www.dataintensity.com/assets/images/partners/logos/mongodb.png)

[Website](https://) |
[Documentation](https://) |
[Installation Guide](https:) |
[Contribution Guide](https:) |
[API](https://) |

## OverView

- Car Rental
  ```
    Get Car Details
    Get Full Details Of Individual Car
    -Populated With List Of Available Cars.
    Only Admin/Employee can Add Car Details. And Attach Cars to it.
    Atttached cars Are populated on viewing Individual car as Available cars.
    If the User Tries To Add Or Do Anything With Admin Rights 
    He Will Get Message Of Not Allowed.
    
   As Client Side - User Can View Cars With Filter-Sort And 
   By Default Page With 6 Items/Cars Will be Displayed.
   And User Can Book Car Using Stripe API - And Cash Booking Also Available.
   
   Future Upgrade - Dynamic Booking Time
  ```
- Shop Car Parts
  ```
   Get Car Parts 
   Only Admin/Employee can Add Car Part Details.
   User Can Search By Part Number - CarBrand - Category and Also Sort-View With Pagination
   If the User Tries To Add Or Do Anything With Admin Rights He Will Get Message Of Not Allowed.
    
   As Client Side - User Can View Cars Parts and Buy Using Online Payment Only.
   
   Future Upgrade - Cart!!!
  ```
- Hotel Booking
  ```
  Here Users Can Search For Hotels Based On Location 
  Where Users get Hotels Related To The Location By Geo-Location.
  User Can View Rooms On Opening Any Individual Hotel Where He/She can Book Room for 1 Day. -Stripe Payment
  
  Hotel Also Has Review Model Where Users can Review On Hotel.
  
  Future Upgrade - Dynamic Booking Time
  ```
- Forum
  ```
  Here Users Can View Posts With Having Account On Our Website.
  But To Post Or Comment They Should Have Account.
  
  The One Who Posts Threads Can Only Edit/Delete It - Same With Comments.
  
  Users Can also Query For GetMyPosts. 
  Where Only Post Which User Has Written Will Be queried.
  ```
- Blog
  ```
  Blog Is Filled With Reviews/Experience Of Verified/Those Who Have Booking History.
  Users Can Review On Us/EDD By Adding Single Pic And Rate From 1 to 5.
  
  Finally Average Rating Will be Calculated Using Aggregation.
  ```
- User
  ```
  User SignUp - After SignUp They Get Mail Where they Have to Confirm The Mail.
  On Confirm They Will Be Taken Back To Home Url With Logged-In Status.
  
  User Will be Logged In For 24 hrs- After They Will Have To Login Again.
  User has option of forget Password - changed Password After Logged-In.
  Update Pic,Details and Upon adding Driving Licence He/She Will Be given access to book car.
  
  ```
 - Social Media
  ```
  Here User's Who Have Account On EDD will be Given Access To Have Social Media Account.
  On Registering User has just upload pic(Optional) with unique username.
  
  Upon Registering User Will be able to Feeds Of Others Users.
  User Can Also Search Users On Social Media And send Friends Request.
  
  Upon Sending The request The Reciever/To Whom User Sent Will Recieve Mail.
  
  If Current User Tries to Accept Sent Request - The Request Will be Rejected.
  User Cannot send Request To Himself.
  
  The Other User Who Got request, cannot sent request back to him - 
    Where he will be taken to recieved request message.
  
  Upon Successfull Login - 
  ```
  ```
  Both The users can see there Lists of Friends and Comment/ Like On Each Other Post.  
  Even Likes Cannot be Duplicated / User cannot manipulate Someone's Comment or post.
  
  Interaction Related
    User Can Post With Caption And max of 5 images at a time.
    
    While His Friends Can Comment/reply on comment also.
    
  User Can also chat with There Friends Privately.    
  ```

## Quick Start Guide

**Install EDD/Explore Dream Discover**

```bash
$ npm install
```

**Start the server**

```bash
$ npm start
```

## New things used Apart From Node/Express/Mongoose/.....So on!

```
For Images - Google Cloud Platform(GCP)
    If there is new Entry into image structure. new Folder Will be created
    To Avoid Space When User Uploads More than 1 Image Duplicacy will be checked.
    Only Images can Be Uploaded.
For Client - Server or v^s axios
Socket.io for chat
Pug as template Engine
Stripe For Payment.
```
