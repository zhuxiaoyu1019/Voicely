//variable to track current index position being used for title and text area
var displayedIndex = null

//track if title is approved
var titleApproved
//record new title name
var newTitle
//record title selected for loading saved memos
var selectedTitle

var storedTheme = localStorage.getItem("Voicely Theme")


//tracks if an item from memo list is selected to be loaded or deleted
var confirmDelete = false

//object array for storing titles and content
// var memoList = []
var memoList = [{
  title: 'How To Use Voicely',
  content: '1. Start by naming your new Voicly memo.\n\n2. Press record, allow microphone access, then tell Voicely what to type for you!\n\n3. To use voice activated emojis,\n\n  simply say: \n\n    "Voicely `fire` emoji"\n\n\       and Voicely will display that `🔥`\n\n\n4. Do a victory dance\n\n💃 🕺 💃 🕺 💃 🕺 💃 🕺 💃 🕺 💃 🕺 💃 🕺 💃 🕺 💃 🕺 💃 🕺 ',
}, {
  title: 'Grocery List',
  content: '- eggs🥚 🍳\n\n- bread 🍞\n\n- spinach 🥗\n\n- Eggplant 🍆',
}, {
  title: 'To Do',
  content: '1. Short ~1min intro of Voicely\n2. User story/motivation for development\n3. The 2 APIs we used and the json responses we get back\n4. Talk about json and challenges we faced (emoji API not being reliable)\n5. Talk about successes (teamwork, go Sandcat!)\n6. Demo - quickly go over each feature:Creating Voicely\n ⦿ Recording and adding emoji\n ⦿ Saving to localstorage\n ⦿ Searching for saved memos\n ⦿ Sending SMS\n7. Demo for the SMS\n8. Changing Theme color\n9. Text Editor Tool (?)\n10. Questions?',
}, {
  title: 'Why Westley is the cutest',
  content: 'Fluffy fur 😼 \n😻 likes to snuggle\nloves the hoomans 😸',
}, {
  title: '5 Cutest Wildcat Species',
  content: "1. Carcal\n2. Pallas' Cat\n3. Sand Cat 🐈\n4. Rusty Spotted Cat\n5. Margay",
}, {
  title: ' 🔨  Time',
  content: '\n💡     💡  b  💡  u  💡  i  💡  l  💡  d  💡     💡\n\n\n  a  💡  l  💡  l  💡     💡  t  💡  h  💡  e  💡\n\n\n💡  t  💡  h  💡  i  💡  n  💡  g  💡  s  💡     💡'
}]

function colorPage(){
  if(storedTheme !== null){
    oldTheme = storedTheme
    console.log(oldTheme)
  }else{
    oldTheme = "cyan"
  }
  $('body').attr('class','container theme lighten-5 '+ oldTheme)
  $('#pageHeader').attr('class', 'nav-wraper row center white-text theme accent-3 '+ oldTheme)
  $('#voicelyTitle').attr('class', 'theme white-text '+oldTheme)
  $('#newVoicelyBtn').attr('class','btn theme accent-3 waves-effect waves-light '+ oldTheme)
  $('#editTitleBtn').attr('class','btn theme accent-3 waves-effect waves-light '+ oldTheme)
  $('#settingsBtn').attr('class','btn theme accent-3 waves-effect waves-light right '+ oldTheme)
  $('#phraseDiv').attr('class','theme lighten-5 '+ oldTheme)
  $('#recordVoicelyBtn').attr('class','btn theme accent-3 waves-effect waves-light '+ oldTheme)
  $('#smsBtn').attr('class','btn theme accent-3 waves-effect waves-light '+ oldTheme)
  $('#saveVoicelyBtn').attr('class','btn theme accent-3 waves-effect waves-light '+ oldTheme)
}

//check local storage for saved memos
function getLocalStorage() {
  var storedMemos = JSON.parse(localStorage.getItem("Voicely"));
  //if Memos are retrieved, update memoList with data
  if (storedMemos !== null) {
    memoList = storedMemos;
  }
  if (storedMemos !== null && displayedIndex === null){

    $('#phraseDiv').val(`Create a new Voicely or load a previous session 🤓`)
  }
  if (storedMemos === null && displayedIndex === null){
    $('#phraseDiv').val(`Welcome!\n\n Create a new Voicely or load a previous memo to get started 🙂 `)
  }
}
//update data in local storage
function setLocalStorage() {
  localStorage.setItem("Voicely", JSON.stringify(memoList));
}


// load current titles in memoList as saved sessions
function loadMemoList() {
  //clear search input text when new memo is loaded
  $('#search').val('')
  //retrieve latest local storage data
  getLocalStorage()
  //clear contents of #savedList to start fresh
  $('#savedList').empty()
  // color class names ordered to create the list item background fade effect
  var colorClass = ['lighten-2', 'lighten-1', '', 'darken-1', 'darken-2', 'darken-3', 'darken-2', 'darken-1', '', 'lighten-1', 'lighten-2', 'lighten-3']
  //'x' will be used to track our 'colorClass' index position. It will start on index-0
  var x = 0

  for (let i = 0; i < memoList.length; i++) {
    //if x === 11 then reset x to 0 to loop color pattern again
    if (x === 11) {
      x = 0
    }
    //append new list item & add text
    $('#savedList').append($('<li>', { class: oldTheme + ' theme collection-item ' + colorClass[x], id: 'listItem-' + i }))
    $('#listItem-' + i).append($('<span>', { class: 'memo-title', id: 'memoTitle-' + i }))
    $('#memoTitle-' + i).text(memoList[i].title)
    //append link to new list item
    $('#listItem-' + i).append($('<a>', { href: '#!', class: 'secondary-content', id: 'listLink-' + i }))
    //append icon to link
    $('#listLink-' + i).append($('<i>', { class: 'material-icons white-text', id: 'listIcon-' + i, }))
    //set icon text to clear
    $('#listIcon-' + i).text('clear')
    //increment x for the next line item color pattern
    x++
  }
}


//settings used in updatePageScene function for disabling/enabling buttons & #phraseDiv, button text
function voicelyTitleSettings(x, y,){
  $("#voicelyTitle").prop("disabled", x)
  $('#voicelyTitle').attr('class', y)
}
function newVoicelyBtnSettings(x, y){
  $("#newVoicelyBtn").prop("disabled", x)
  $("#newVoicelyBtn").text(y)
}
function editTitleBtnSettings(x,y){
  $("#editTitleBtn").prop("disabled", x)
  $('#editTitleBtn').text(y)
}
function phraseDivSettings(x){
  $('#phraseDiv').prop("disabled", x)
}
function recordSmsSaveBtnSettings(x){
  $('#recordVoicelyBtn').prop("disabled", x)
  $('#smsBtn').prop("disabled", x)
  $('#saveVoicelyBtn').prop("disabled", x)
}
//Layout to create a new Voicely or load a saved session
function pageSceneStart(){
  voicelyTitleSettings(true,  'white-text theme ' + oldTheme)
  $("#voicelyTitle").val('')
  $('#alertText').text('')
  newVoicelyBtnSettings(false, 'New Voicely')
  editTitleBtnSettings(true, 'Edit Title')
  $('#settingsBtn').prop('disabled', false)
  phraseDivSettings(true)
  $('#phraseDiv').val('')
  recordSmsSaveBtnSettings(true)
}
//Layout to create a new Voicely memo, or cancel and return to START-UP SCREEN
function pageSceneLoadMemo() {
  voicelyTitleSettings(false, 'white-text lighten-3 theme ' + oldTheme)
  newVoicelyBtnSettings(false, 'Cancel')
  editTitleBtnSettings(false, 'Save Title')
  phraseDivSettings(true)
  recordSmsSaveBtnSettings(true)
}
//Layout to edit the title of an existing memo
function pageSceneEditTitle() {
  voicelyTitleSettings(false, 'white-text lighten-3 theme ' + oldTheme)
  newVoicelyBtnSettings(false, 'Cancel')
  editTitleBtnSettings(false, 'Update Title')
  phraseDivSettings(true)
  recordSmsSaveBtnSettings(true)
}
//Layout for working on a current Voicely memo
function pageSceneEditContent() {
  voicelyTitleSettings(true, 'white-text theme ' + oldTheme)
  $('#alertText').text('')
  newVoicelyBtnSettings(false, 'New Voicely')
  editTitleBtnSettings(false, 'Edit Title')
  phraseDivSettings(false)
  recordSmsSaveBtnSettings(false)
}

//approve or deny a title input from a user
function approveNewTitle() {
  //if title is empty, deny and alert user
  if (newTitle !== '') {
    titleApproved = true
  } else {
    $('#alertText').text(`*title can not be blank`)
    return
  }
  console.log(displayedIndex)
  //if title is not empty, and title matches the current displayed title, allow it and return
  if (titleApproved && displayedIndex !== null && memoList[displayedIndex].title.toLocaleLowerCase().trim() === newTitle.toLowerCase().trim()) {
    titleApproved = true
    return
    //if title matches a different index location, deny to avoid duplicate title names and alert user to
  } else {
    for (let i = 0; i < memoList.length; i++) {
      if (memoList[i].title.toLocaleLowerCase().trim() === newTitle.toLowerCase().trim()) {
        titleApproved = false
        console.log(`The title: '${memoList[i].title}', already exists at index ${i}`)
        $('#alertText').text(`"${newTitle}" already exists`)
      }
    }
  }
}


//lauched after new title is approved to create the new object in the array
function createNewVoicely() {
  var newMemoObject = {
    title: newTitle,
    content: ''
  }
  //add the new memo object to our memoList
  memoList.push(newMemoObject)
  //update local storage
  setLocalStorage()
  //update displayedIndex to refrence our newly created & currently selected index
  displayedIndex = memoList.length - 1
  selectedTitle = memoList[displayedIndex].title
  console.log(`current index is ${displayedIndex}, title: ${memoList[displayedIndex].title}`)
  //reload the list to display the new object
  loadMemoList()

  //clear text from previously displayed Memo
  $('#phraseDiv').text('')
  //update the page scene with variable that is true
  pageSceneEditContent()

  console.log(displayedIndex)
  console.log(memoList)
}

//find the index location where 'selectedTitle' lives. This is used to load the title and content onto the page when loading a saved memo.
//displayIndex is also used to track the index loaction of the current loaded memo for auto-saving and editing purposes.
function findDisplayedIndex() {
  //loop through the memolist array
  for (let i = 0; i < memoList.length; i++) {
    //if the memo.title property matches the text value saved in "selectedTitle", save that index number to 'displayedIndex' variable
    if (memoList[i].title === selectedTitle) {
      displayedIndex = i
    }
  }
}


//refrencing the displayedIndex variable, load the memo selected by the user
function loadVoicelyMemo() {
  $('#voicelyTitle').val(memoList[displayedIndex].title)
  //empty #phraseDiv before loading content to avoid concatination of previous and new content
  $('#phraseDiv').val('')
  $('#phraseDiv').val(memoList[displayedIndex].content)
}


//refrencing the current index, update the content of current memo
function saveCurrentVoicely() {

  if (displayedIndex !==  null){
    //save current content in #phraseDiv and set as the new value for the displayed index
    var updateContent = $('#phraseDiv').val()
    memoList[displayedIndex].content = updateContent
    //update local storage with new values
    setLocalStorage()
    console.log(`1. '${memoList[displayedIndex].title}' content auto-saved`)
  }
}

function confirmDeleteMemo(x) {
  var displayedTitle = $('#voicelyTitle').val()
  //grab the title text and save it in a variable
  var thisIndex
  //comfirm with user if they would like to delete

  //find the index location wher 'thisTitle' is held and store index number it in 'thisIndex'
  for (let i = 0; i < memoList.length; i++) {
    if (memoList[i].title === x) {
      thisIndex = i
    }
  }

  modalConfirm( "Really delete \"" + x + "\"?", yesFunc, noFunc );

  function yesFunc() {
      //Remove the deleted index from memoList
      memoList.splice(thisIndex, 1)
      //scenario where the item displayed is the item being deleted
      if (x === displayedTitle) {
        //update page scene since displayed content was just deleted
        pageSceneStart()

        displayedIndex = null
        // if memo being deleted is not the current memo displayed
      }
      //console.log to confirm deletion (or lack thereof) for dev purposes
      console.log(memoList)
      //update localstorage to reflect deleted memo
      setLocalStorage()
      confirmDelete = false
      loadMemoList();
  }

  function noFunc() {
    confirmDelete = false
    loadMemoList();
  }
}


//listen for click on 'new voicely' button
$(document).on('click', '#newVoicelyBtn', function (event) {
  // if no Memo is loaded (start up page) and user clicks new memo, change page scene to 'LoadMemo'
  if (displayedIndex === null && $(this).text().toLocaleLowerCase() === 'new voicely') {
    saveCurrentVoicely()
    //update button scene
    pageSceneLoadMemo()

    return
  }
  //if no Memo is loaded and user clicks 'cancel', return to start up screen
  if (displayedIndex === null && $(this).text().toLocaleLowerCase() === 'cancel') {
    pageSceneStart()

    return
  }
  // if a memo is loaded and a user clicks 'new voicely' 
  if (displayedIndex !== null && $(this).text().toLowerCase() === 'new voicely') {
    saveCurrentVoicely()
    //update page scene
    pageSceneLoadMemo()
    //clear title and content for new Memo creation
    $('#voicelyTitle').val('')
    $('#phraseDiv').val('')
    return
  }
  //if a memo is loaded, and a user clicks 'new voicely', then clicks 'cancel' to return to current memo
  if (displayedIndex !== null && $(this).text().toLowerCase() === 'cancel') {
    //update page scene
    pageSceneEditContent()
    //reload the voicely memo that was loaded before 'new voicely' was clicked
    loadVoicelyMemo()
  }
})


//listen for click  on 'edit title' button
$(document).on('click', '#editTitleBtn', function (event) {
  //if button is clicked and text displays 'save title',
  //user is in the process of updating a current memo or creating a new memo title
  if ($(this).text().toLocaleLowerCase() === 'save title') {
    //save the text value of the 'title' input
    newTitle = $('#voicelyTitle').val()
    //check title for approval
    approveNewTitle()
    //if title is approved
    if (titleApproved) {
      //create the new memo object
      createNewVoicely()
      $('#phraseDiv').val('')
      //reset the title approved variable
      titleApproved = false
    }
    console.log(memoList)
    return
  }
  //if button is clicked and text displays 'edit title', user has an active Memo loaded
  if ($(this).text().toLowerCase() === 'edit title') {
    //load page scene to edit title name
    pageSceneEditTitle()
    return
  }

  //if button is clicked and text displays 'update title',
  //user is attempting to change the name of the current loaded Memo
  if ($(this).text().toLocaleLowerCase() === 'update title') {
    //save user input text
    newTitle = $('#voicelyTitle').val()
    //check to see if new title is approved
    approveNewTitle()
    //if new title is approved
    if (titleApproved) {
      //update current memo object with new title name
      memoList[displayedIndex].title = newTitle
      console.log(memoList)
      //update local storage
      setLocalStorage()
      //reload the Memo list to display updated title name
      loadMemoList()
      //update the page scene
      pageSceneEditContent()
      //reset approved title variable
      titleApproved = false
    }
    return
  }
})

$('.collection').on('click', '.secondary-content', function () {
  confirmDelete = true
  // console.log($(this).text())
  var thisTitle = $(this).prev().text()
  console.log('secondary-content')
  confirmDeleteMemo(thisTitle)
})

//listen for a click on any saved Memo
$('.collection').on('click', '.collection-item', function () {
// $('.collection').on('click', '.memo-title', function () {
  // console.log($(this).val())
  if(confirmDelete === false) {

    findDisplayedIndex()
    selectedTitle = $(this).find('span').text()
    //if a memo is selected and the edit title button displays 'edit title',
    //user is not in the middle of changing a current title name, so
    //user is allowed to load memo
    if ($('#editTitleBtn').text().toLowerCase() === 'edit title') {
      //if no memo is loaded
      if (displayedIndex === null) {
        //find the index of the memo selected
        findDisplayedIndex()
        //if a memo is currently loaded, index will not be null
      } else {
        //check to see if currrent memo content should be updated before loading the selected memo
        saveCurrentVoicely()
        //find the index of the memo selected to load
        findDisplayedIndex()
      }
      //load the page with the index if the Memo selected
      loadVoicelyMemo()
      console.log(`2. '${memoList[displayedIndex].title}' loaded from index-${displayedIndex}`)
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      //update page scene
      pageSceneEditContent()
      //refresh page if any delete buttons were activated but not confirmed
      loadMemoList()
    } else {
      //if button does not display text of 'edit title',
      //then user is in the middle of creating a new memo or loading a saved memo
      //alert user and deny loading the selected memo
      $('#alertText').text("*Update 'title' or cancel")
    }
  }
  })
  
//listen for a click on save content button, when clicked updatet the conent value refrenced in displayedIndex
$(document).on('click', '#saveVoicelyBtn', function () {
  saveCurrentVoicely()
})

// load page on startup screen
colorPage()
pageSceneStart()
loadMemoList()