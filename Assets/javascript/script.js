// Global variables
var SpeechSDK;
var recognizer;
var emojiList;

$("document").ready(function () {

  // key option 1
  var APIkey = '2b307e3e19a6de2e97c409b817d0a381eec4b0e1'
  // key option 2
  // var APIkey = '8b4259ccd704fd17cd7ad399e0ee00b9dd83faab';
  // emojiURL option 1
  // var emojiURL = `https://emoji-api.com/emojis?search=${x}&access_key=${APIkey}`;
  // emojiURL option 2
  var emojiURL = `https://emoji-api.com/emojis?access_key=${APIkey}`;

  $.get(emojiURL).then(function (emResponse) {
    emojiList = emResponse;
    // console.log( a );
    console.log(emojiList);
    // If the emoji API server is down, use the response stored in "emoji.json" as a backup 
  }).fail(function () {
    emojiList = emojiS;
  }).then(function () {
    // Always adds the content of characters.json.
    characterS.forEach((obj) => emojiList.push(obj));
  })

  $("#recordVoicelyBtn").on("click", function () {
    $("#recordVoicelyBtn").prop("disabled", true)
    // Use the subscription key and configure the SpeechSDK object provided by the file referenced in the index.html file.
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("20bad3c2c2a34e2a9ada0c04f778f495", "eastus");
    // Set speech recognition language to US English
    speechConfig.speechRecognitionLanguage = "en-US"
    // Add the user's microphone input
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    // Create the SpeechRecognizer object
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // Start the voice recognition method. May need to replace with StartContinuousRecognitionAsync later on for more prolonged recognition
    recognizer.recognizeOnceAsync(
      // If we're successful.
      function (result) {
        // Make the button to start speech recognition work again.
        $("#recordVoicelyBtn").prop("disabled", false)
        // Voicesearch takes the text results and the full list of emojis as arguments.
        voiceSearch(result.privText, emojiList);
        window.console.log(result)

        // Close the SpeechRecognizer object, and set the variable to undefined.
        recognizer.close();
        recognizer = undefined;
      },
      // If there's an error.
      function (err) {
        // Also sets the button to work again.
        $("#recordVoicelyBtn").prop("disabled", false)
        // Add the error to the div that spells out text
        $("#phraseDiv").text(err)
        // log error to the console.
        window.console.log(err);

        // Close the SpeechRecognizer object, and set the variable to undefined.
        recognizer.close();
        recognizer = undefined;
      });
  });

  // Search for and show memos that match the search term, hide all others
  $("#search").keyup(function () {
    var filter = $("#search").val().toUpperCase();
    $("li > span").each(function () {
      if ($(this).text().toUpperCase().indexOf(filter) > -1) {
        $(this).parent().show()
      } else {
        $(this).parent().hide()
      }
    })
  })

  var themeColor = ["red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime", "yellow", "amber", "orange", "deep-orange", "brown", "grey", "blue-grey"]
  var oldTheme = "cyan"
  var newTheme

  for (i = 0; i < themeColor.length; i++) {
    $("#palette").append($("<span>", { class: themeColor[i], style: "padding: 0 1vw;" }))
  }

  $("#palette").hide()
  $("#settingsBtn").on("click", function () {
    $("#palette").show()
  })

  $("#palette > span").on("click", function () {
    newTheme = $(this).attr("class")
    $(".theme").switchClass(oldTheme, newTheme)
    oldTheme = newTheme
    $("#palette").hide()
  })
});