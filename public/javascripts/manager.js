/**
 * Created by sidspacewalker on 9/22/15.
 */

manager = {

    getAllSongs: function () {
        $.ajax({
            url: '/library/songs',
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                ;var ret = JSON.stringify(data);
                $('#library').append(tableFromJSON(data));
            }
        });
    }
};