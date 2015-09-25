/**
 * Created by sidspacewalker on 9/22/15.
 * Several utility functions in here.
 */

NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] // Music notes

// what to do when the page loads
$(document).ready(function() {

    $('#library table tbody').on('click','td a.showSongLink', manager.getSong); // when a song link is clicked

    // when one of the buttons with music notes on them is clicked
    $('.NoteButtons').on(
        {
            'click': function () {
                var inpNotesField = $('#inputMelody');
                var curval = inpNotesField.val();
                inpNotesField.val(curval + ' ' +$(this).text());
                },
            'mousedown': function () { $(this).css('background','#00E5EE');},
            'mouseup':function () { $(this).css('background','');}
        });

    // Add, Update, Clear and Delete buttons' on click handlers
    $('#clearFieldsBtn').on('click', function () {showSongInfo({},true);});
    $('#addSongBtn').on('click',  manager.addSong);
    $('#updateSongBtn').on('click',  manager.updateSong);
    $('#deleteSongBtn').on('click',  manager.deleteSong);

    // get the library from the server
    manager.getAllSongs();
});

/*
* This function take a string and returns a subset of it only with duplicated characters
* */
function getDuplicates(s) {
    var hash = {}; // table to hash characters from the string 1 would mean it has been seen before, 2 would mean if has been added to the list of duplicates
    var ret = ''; // create a new string because string are immutable in JS
    for (var i=0; i<s.length; i++) {

        if (!hash.hasOwnProperty(s[i])) {
            // haven't seen this character yet, then add it to the hash
            hash[s[i]]=1;
        } else if (hash[s[i]]==1) {
                // we have seen this character before
                // so add this character to the duplicates list
                ret = ret + s[i];
                hash[s[i]]=2;
        }
        }
    return ret;
}




/*
* Get JSON data for a song and make HTML link for it
*/
function tableFromJSON(jsonData) {
    var tableContent='';
    $.each(jsonData, function() {
        tableContent += '<tr id="'+ this.Id +'">';
        tableContent += '<td><a href="#" class="showSongLink" rel="' + this.Id + '" title="Show Details">' + this.Title + '</a></td>'
        tableContent += '</tr>';
    });
    return tableContent;
}

/*
 * When a song is clicked on. Show its details
 */
function showSongInfo(data,isClear) {
    var buttonToShow;
    var buttonToHide;

    // when we select a song, show the clear, update and delete buttons only.
    if (isClear) {
        data = {Id: '', Title: '', Artist: '', Genre: '', Notes: ''};
        buttonToShow =  $('#addSongBtn')
        buttonToHide =  $('#updateSongBtn')
        $('#deleteSongBtn').attr('hidden', true);
    } else {
        buttonToShow =  $('#updateSongBtn')
        buttonToHide =  $('#addSongBtn')
        $('#deleteSongBtn').attr('hidden', false);
    }
    $('#inputID').val(data.Id);
    $('#inputTitle').val(data.Title);
    $('#inputArtist').val(data.Artist);
    $('#inputGenre').val(data.Genre);
    $('#inputMelody').val(decodeNotes(data.Notes));
    $('#DupNotes').text(decodeNotes(getDuplicates(data.Notes)))

    buttonToShow.attr('hidden',false);
    buttonToHide.attr('hidden',true);

    $('#inputTitle').focus();
}

/*
 * Data for a song
 */
function songData() {
  return {
      Id: $('#inputID').val() ? $('#inputID').val() : manager.uniqueIDCount, // if this is a new song send a new ID, otherwise send existing ID
      Title: $('#inputTitle').val(),
      Artist: $('#inputArtist').val(),
      Genre: $('#inputGenre').val(),
      Notes: encodeNotes($('#inputMelody').val())
  };
}

/*
 * Encode the notes entered to base 16.
 * Only doing this so the code for each note can be 1 character and
 * I can plug the melody into the remove duplicates function
 */
function encodeNotes(melody) {
    var rawNotes = melody.trim().split(' ');
    var error=false;
    var ret;
    ret = rawNotes.map(
        function (x) {
            var idx;
            idx=NOTES.indexOf(x.toUpperCase());
            if (idx>=0) {
                return (idx.toString(16).toUpperCase());
            } else {
                error = true;
                return '';
            }
    }).join('');

    if (error) return 'ERROR';
    else return ret;
}

/*
 * Get the Melody string from the server and change it to user seravable form
 */
function decodeNotes(melody) {
    var l = melody.length;
    var res = '';
    var noteIndex;
    for (var i=0; i<l;i++) {
        noteIndex = parseInt(melody.charAt(i), 16);
        if (noteIndex>=0 && noteIndex<12) {
            res = res + NOTES[noteIndex];
            if (i<l-1) res = res + ' ';
        }
    }

    return res;
}

/*
 * Populate library table
 */
function populateSongTable(data) {
    $('#library table tbody').html(tableFromJSON(data))


    var dataset = []
    $('#library tr').each(function(x) {
        dataset.push(manager.libraryData[$(this).attr('id')].Notes);
    });
}

/*
 * Add song to the library UI
 */
function addSongUI(data) {

    manager.uniqueIDCount++;
    $('#addSongBtn').attr('hidden', true);
    $('#updateSongBtn').attr('hidden', false);
    $('#deleteSongBtn').attr('hidden', false);
    $('#inputID').val(data.Id);
    $('#DupNotes').text(decodeNotes(getDuplicates(data.Notes)))
    alert('Successfully added ' + data.Title);
    manager.libraryData[data.Id]=data;
    $('#library tr:last').after('<tr id="'+ data.Id +'"><td><a href="#" class="showSongLink" rel="' + data.Id + '" title="Show Details">' + data.Title + '</a></td></tr>');
}

/*
 * Delete song from the library UI
 */
function deleteSongUI(songID, songTitle) {
    alert('Successfully deleted ' + songTitle);
    $('#' +songID).remove();
    showSongInfo({},true);
}

/*How duplicative is */