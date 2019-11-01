Basic usage
-----------

Edit the source code of your web page:

**HTML**

.. code:: html

   <head>
     <!-- Include Interactive Image jQuery plugin Styles -->
     <link rel="stylesheet" href="interactive-image.min.css" />

     <!-- Specific styles of a scene -->
     <style>
     .interactive-image {
       width: 900px;
       height: 600px;
       background: url("/path/to/main-image.png");
     }
     </style>
   </head>
   <body>
     <!-- Main container of a scene -->
     <div id="my-interactive-image"></div>

     <!-- Include jQuery -->
     <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

     <!-- Include Interactive Image jQuery plugin JavaScript -->
     <script src="interactive-image.min.js"></script>
   </body>

**Note regarding the css file:** You may have to rewrite the relative
paths of the fonts.

**JavaScript**

This code block describes the 5 types of items: a simple text, a picture,
a sound, a video, and a content provided by a tier.

.. code:: javascript

   // Items collection
   var items = [
     {
       type: "text",
       title: "Fur",
       description: "The fur of clouded leopards is...",
       position: {
           left: 100,
           top: 50
       }
     },
     {
       type: "picture",
       path: "/path/to/picture.png",
       caption: "A baby clouded leopard",
       position: {
         left: 200,
         top: 300
       }
     },
     {
       type: "audio",
       path: "/path/to/sound.mp3",
       caption: "A clouded leopard growl",
       position: {
         left: 300,
         top: 500
       }
     },
     {
       type: "video",
       path: "/path/to/video.mp4",
       caption: "A clouded leopard walking",
       poster: "/path/to/poster.png",
       position: {
         left: 400,
         top: 550
       }
     },
     {
       type: "provider",
       providerName: "youtube",
       parameters: {
         videoId: "iPRiQ6SBntQ"
       },
       position: {
         left: 600,
         top: 550
       },
       sticky: true
     }
   ];

   // Plugin activation
   $(document).ready(function() {
     $("#my-interactive-image").interactiveImage(items);
   });

You can see a full working example including all types of items in the ``examples`` directory.