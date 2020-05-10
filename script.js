$(document).ready(function () {
  //globalKey to an empty array
  var globalKey = [];
 
 //buttons for user to insert link to inp_test
  $("#anger-btn").click(function(){
    $("#inp_test").val(  "https://kferg-images.s3.amazonaws.com/anger.jpeg");
  });
 

   
  $("#sad-btn").click(function(){
    $("#inp_test").val("https://kferg-images.s3.amazonaws.com/sadness.jpeg");
  });
 
 
   
  $("#happy-btn").click(function(){
    $("#inp_test").val(  "https://kferg-images.s3.amazonaws.com/happiness.jpg");
  });

   
  $("#disgust-btn").click(function(){
    $("#inp_test").val(  "https://kferg-images.s3.amazonaws.com/disgust.jpg");
  });
 
   
  $("#suprise-btn").click(function(){
    $("#inp_test").val( "https://kferg-images.s3.amazonaws.com/surprise.jpg");
  });
 


  //hides image container
  $("#image-display").hide();
  //hides video container
  $("#video-card").hide();
  $("#btn_test").on("click", function (event) {
    function clearArray() {
      return (globalKey = []);
    }
    clearArray();
    $("#image-display").show();
    event.preventDefault();
    $("#emotion-dis").empty();
    //ajax call for face ++
    $.post({
      url: "https://limitless-tor-79246.herokuapp.com/cors/fpp/detect",
      data: {
        key: "11e2d980d599766aa84847ae504d0f8257e7afacc76a285b05979fb7e17974e5",
        api_key: "iAkzJ9qQO4_kAbHayFcsVof5lMfA26ko",
        secret_key: "QciSc6-QLGy3AxZdnIEUnFgz_Jml88LY",
        image_url: $("#inp_test").val(),
        return_attributes: "emotion",
      },
      method: "POST",
    }).then(function (response) {
      console.log(response);
      $("#image-display").attr("src", $("#inp_test").val());
      var emotions = response.faces[0].attributes.emotion;
      // console.log(emotions);
      // var emotionDisplay = JSON.stringify(emotions);
     
    
     //goes through emotions variable and get the emotion and value percentage
      $.each(emotions, function (key, value) {
        globalKey.push(emotions);
        $("#emotion-dis").append(
          key + " : " + Math.round(value * 1) + " % " + "<br>"
        );
      });
      // sets key into globalkey array
      var key = Object.keys(globalKey);
      //setsvalue into global key array
      var value = Object.values(globalKey);
    
      var listEmotion = value[0];
  
      var sortable = [];
      for (var emo in listEmotion) {
        sortable.push([emo, listEmotion[emo]]);
      }
   
      sortable.sort(function (b, a) {
        return b[1] - a[1];
      });
     
     
      console.log("this is sortable", sortable[6][0]);
      
      
      

      // finds keywords to search video
      var finalEmotion = sortable[6][0];
      // console.log(finalEmotion);
      function videoRender() {
        $.ajax({
          type: "GET",
          url: `https://www.googleapis.com/youtube/v3/search`,
          data: {
            key: "AIzaSyBckegWKc5e-jmUexIsbeywgSA3xMqs3wA",
            q: finalEmotion + "music video",
            part: "snippet",
            maxResults: 50,
            type: "video",
            videoEmbeddable: true,
          },
          //success will calll a fucntion with data we receive back from our get request
          success: function (data) {
            embedVideo(data);
          },
          // error will console log request failed
          error: function (response) {
            console.log("request failed");
            console.log(response);
          },
        });
      
      
      //function to embed the video
        function embedVideo(data) {
      
          console.log(data)
      
          //used math.floor to loop  throught list of videos
          var index = Math.floor(Math.random() * 50);
          $("#video").attr(
            "src",
            "https://www.youtube.com/embed/" + data.items[index].id.videoId
          );
          $("h3").text(data.items[index].snippet.title);
        }
      }
      
      videoRender();
  

      $("#video-card").show();
    });
  });
});
