/**
 * Created by sidspacewalker on 9/22/15.
 * PURPOSE: RESTful APIs to manage all server requets for the website
 */

manager = {

    /* libraryData caches the music library data that we get from the server. Currently we are not so that we can demonstrate the CRUD APIs.
       If the data is big, we probably will implement paging or some other sort of caching instead of caching all the data at once.
     */
    libraryData: {},

    uniqueIDCount: 1, // creates the unique ids of any songs that are added.

    /* get the music library from the server*/
    getAllSongs: function () {
        $.ajax({
            url: '/library/songs',
            dataType: 'json',
            type: 'GET',

            success: function (res) {

                // handle database errors
                if (res.hasOwnProperty('code')) {
                    if (res.code) alert('Database Error: ' + res.code + '. Could not get library.');
                    return;
                }

                // populate cache
                for (var i=0; i<res.length; i++) {
                    var obj = res[i];
                    if (obj.Id) {
                        manager.libraryData[obj.Id]=obj;
                    }
                }
                // get the next uniqueID that we may use
                manager.uniqueIDCount = Math.max.apply(Math, Object.keys(manager.libraryData)) + 1;

                populateSongTable(res);
            },

            error: function (xhr, errText, errorThrown) {
                manager.errorHandler(this.type, xhr, errText, errorThrown);
            }
        });
    },

    /* Get a particular song from the library*/
    getSong: function (event) {

        // get song id from the hyperlink that was clicked
        var songID = $(this).attr('rel');

        $.ajax({
            url: '/library/songs/' + songID,
            dataType: 'json',
            type: 'GET',
            success: function (res) {

                // handle database errors
                if (res.hasOwnProperty('code')) {
                    if (res.code) alert('Database Error: ' + res.code + '. Could not get library.');
                    return;
                }

                showSongInfo(res);
            },

            error: function (xhr, errText, errorThrown) {
                manager.errorHandler(this.type, xhr, errText, errorThrown);
            }
        });
    },

    /* Add a song with the information entered by the user into the library*/
    addSong: function (event) {
        song = songData();

        // validate notes input
        if (song.Notes == 'ERROR') {
            alert('Please input valid notes.');
            $('#inputMelody').focus();
            return;
        }
        $.ajax({
            url: '/library/songs',
            dataType: 'json',
            type: 'POST',
            data: song,
            success: function (res) {

                // handle database errors
                if (res.hasOwnProperty('code')) {
                    if (res.code) alert('Database Error: ' + res.code + '. Could not get library.');
                    return;
                }

                addSongUI(res);

            },

            error: function (xhr, errText, errorThrown) {
                manager.errorHandler(this.type, xhr, errText, errorThrown);
            }
        });
    },

    /*Update a song in the library*/
    updateSong: function (event) {
        var songID = $('#inputID').val();
        if (!songID) return;
        song = songData();

        if (song.Notes == 'ERROR') {
            alert('Please input valid notes.');
            $('#inputMelody').focus();
            return;
        }
        $.ajax({
            url: '/library/songs/' + songID,
            dataType: 'json',
            type: 'PUT',
            data: song,
            success: function (res) {

                // handle database errors
                if (res.hasOwnProperty('code')) {
                    if (res.code) alert('Database Error: ' + res.code + '. Could not get library.');
                    return;
                }

                alert('Successfully updated ' + res.Title);
                $('#DupNotes').text(decodeNotes(getDuplicates(res.Notes)))
                manager.libraryData[res.Id]=res;
            },

            error: function (xhr, errText, errorThrown) {
                manager.errorHandler(this.type, xhr, errText, errorThrown);
            }
        });
    },

    /*delete a song from library*/
    deleteSong: function (event) {
        var songID = $('#inputID').val();
        var songTitle = $('#inputTitle').val();
        if(confirm('Are you sure you want to delete ' + songTitle + '?')) {
            $.ajax({
                url: '/library/songs/' + songID,
                dataType: 'json',
                type: 'DELETE',
                success: function (res) {

                    // handle database errors
                    if (res.hasOwnProperty('code')) {
                        if (res.code) alert('Database Error: ' + res.code + '. Could not get library.');
                        return;
                    }

                    deleteSongUI(songID, songTitle);
                },

                error: function (xhr, errText, errorThrown) {
                    manager.errorHandler(this.type, xhr, errText, errorThrown);
                }
            });
        }
    },

    /*Server Request error handler*/
    errorHandler: function (requestType, xhr, errText, errorThrown) {

        alert(requestType + ' Request Failed: \n' +
              '  Error Status: ' + xhr.status +
              '\n  Error Thrown: \n' + errorThrown)
    }

};