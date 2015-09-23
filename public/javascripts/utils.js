/**
 * Created by sidspacewalker on 9/22/15.
 */

$(document).ready(function() {
    $('.NoteButtons').on(
        {
            'click': function () {
                var inpNotesField = $('#inputNotes');
                var curval = inpNotesField.val();
                $('#inputNotes').val(curval + ' ' +$(this).text());
                },
            'mousedown': function () { $(this).css('background','#00E5EE');},
            'mouseup':function () { $(this).css('background','');}
        });
    manager.getAllSongs();
    d3.select('#D3Test')
        .selectAll('div')
        .data(['aaasddddd','sdsdsdsd','eqwfewfe'])
        .enter().append('div')
        .style('width',function(d){return 20*removeDuplicates(d).length + 'px';})
        .text(function (d) {return removeDuplicates(d);})
});

function removeDuplicates(s) {
    var hash = {};
    var un = 0;
    var ret = ''; // create a new string because string are immutable in JS
    for (var i=0; i<s.length; i++) {
        if (!hash.hasOwnProperty(s[i])) {
            s[un] = s[i];
            hash[s[i]]=1;
            un++;
        }
    }
    return s.slice(0,un);
}


function tableFromJSON(jsonData) {
    var tableContent='';
    $.each(jsonData, function() {
        tableContent += '<tr>';
        tableContent += '<td><a href="#" rel="' + this.Title + '" title="Show Details">' + this.Title + '</a></td>'
        tableContent += '</tr>';
    });
    return tableContent;
};