$(document).ready(function () {
    $('#dtOrder').DataTable({
        "order": [[ 0, "asc" ]]
    });
    $('.dataTables_length').addClass('bs-select');
});