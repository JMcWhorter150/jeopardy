$(document).ready(function () {
    $('#dtOrder').DataTable({
        "order": [[ 1, "desc" ]]
    });
    $('.dataTables_length').addClass('bs-select');
});