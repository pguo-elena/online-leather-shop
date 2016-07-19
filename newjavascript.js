/*
 * CS-425-Project-Javascripts
 */
var Table_Name = "";
var Key_Name = [];
var Key_Val = [];
var Err_Msg = "";

$(document).ready(function () {
     $('#edu').click(function () {
     $('#Main_Page')
     .html('')
     .append('<h2>Reloading Page ...</h2>');
     location.reload(true);
     });
    $('#Nav_Part_1').click(function () {
        $('#Main_Page').fadeOut("fast", function () {
            Part1_Click();
        });
    });
    $('#Nav_Part_2').click(function () {
        $('#Main_Page').fadeOut("fast", function () {
            Part2_Click();
        });
    });
    $('#Nav_Part_3').click(function () {
        $('#Main_Page').fadeOut("fast", function () {
            Part3_Click();
        });
    });
    $('#Nav_Right').click(function () {
        $('#Nav_Right').css("color", Rand_Color());
    });
    $('body')
            .on('click', '.Part_3_Prob', function () {
                $('.Part_3_Prob').parent().removeClass("active");
                $(this).parent().addClass("active");
                var num = Number($(this).attr("num"));
                $('#Left_Side').fadeOut("fast", function () {
                    Probs_Func(num);
                });
            })
            .on('click', '.Right_Tables', function () {
                $('.Right_Tables').parent().removeClass("active");
                $(this).parent().addClass("active");
                Table_Name = $(this).html();
                $('#Left_Side').fadeOut("fast", function () {
                    $('.col-md-9 h2').html("Now Working on Table '" + Table_Name + "'");
                    Part2_Func($('#Nav_in_Part2 li.active a').html());
                });
                $('#Left_Side').fadeIn("fast");
            })
            .on('click', '.Nav_P2', function () {
                $('.Nav_P2').parent().removeClass("active");
                $(this).parent().addClass("active");
                var temp = $(this).html();
                $('#custom').fadeOut("fast", function () {
                    Part2_Func(temp);
                });
                $('#custom').fadeIn("fast");
            })
            .on('keyup', '#searchInput', function () {
                //split the current value of searchInput
                var data = this.value.split(" ");
                //create a jquery object of the rows
                var jo = $("#fbody").find("tr");
                if (this.value === "") {
                    jo.show();
                    return;
                }
                //hide all the rows
                jo.hide();
                //Recusively filter the jquery object to get results.
                jo.filter(function (i, v) {
                    var $t = $(this);
                    for (var d = 0; d < data.length; ++d) {
                        if ($t.is(":contains('" + data[d] + "')")) {
                            return true;
                        }
                    }
                    return false;
                })
                        //show the rows that match.
                        .show();
            })
            .on('focus', '#searchInput', function () {
                this.value = "";
                $(this).css({
                    "color": "black"
                });
                $(this).unbind('focus');
            });
});

function Part1_Click() {
    $('.col-md-9 h2').html("Entity Relationship Diagram");
    $('.col-md-3 h2').html("");
    $('#Right_Side ul').html("");
    $('#question').html("");
    $('#custom').html('<img src="ERD.png" class="img-responsive" alt="Entity Relationship Diagram" height="1080px" width="937px">');
    $('#result').html("");
    $('#Main_Page').fadeIn("fast");
}

function Part2_Click() {
    $('.col-md-9 h2').html("Create, Read, Update, Delete");
    $('.col-md-3 h2').html("Tables");
    $('#question').html("");
    $('#custom').html("");
    $('#result').html("");
    $('#question').append('<ul class="nav nav-tabs" id="Nav_in_Part2"></ul>');
    $('#Nav_in_Part2')
            .append('<li class="active"><a href="#" class="Nav_P2">Create</a></li>')
            .append('<li><a href="#" class="Nav_P2">Read</a></li>')
            .append('<li><a href="#" class="Nav_P2">Update</a></li>')
            .append('<li><a href="#" class="Nav_P2">Delete</a></li>');
    $.ajax({
        type: "GET",
        url: "P1.php",
        data: 'p=RightGetTables',
        success: function (msg) {
            $('#Right_Side ul').html(msg);
        }
    });
    Table_Name = "";
    $('#question').append('<div id="Show"></div>');
    $('#custom').html('<p class="To_Start">To Create, Please Select a Table to Start</p>');
    $('#Main_Page').fadeIn("Fast");
}

function Part2_Func(str) {
    $('#result').html("");
    if (Table_Name !== "") {
        switch (str) {
            case "Create":
                $('#custom')
                        .html("")
                        .append('<form class="form-horizontal" id="Create_Form" style="max-height:500px;overflow:auto"></form>');
                $.ajax({
                    type: "GET",
                    url: "P1.php",
                    data: 'p=Create&name=' + Table_Name,
                    success: function (msg) {
                        $('#Create_Form')
                                .attr("onsubmit", "return Part2_Create()")
                                .append(msg);
                    }
                });
                break;
            case "Read":
                $('#custom').html('<input id="searchInput" class="form-control" placeholder="Search this table">');
                $.ajax({
                    type: "GET",
                    url: "P1.php",
                    data: 'q=8&str=SELECT * FROM ' + Table_Name,
                    success: function (msg) {
                        $('#result').html(msg);
                    }
                });
                break;
            case "Update":
                $('#custom')
                        .html("")
                        .append('<form id="Pkey_Form"></form>');
                $('#Pkey_Form')
                        .addClass("form-horizontal")
                        .attr("onsubmit", "return Part2_Update()");
                $.ajax({
                    type: "GET",
                    url: "P1.php",
                    data: 'p=PriKey&num=0&name=' + Table_Name,
                    success: function (msg) {
                        $('#Pkey_Form').append(msg);
                    }
                });
                break;
            case "Delete":
                $('#custom')
                        .html("")
                        .append('<form id="Pkey_Form"></form>');
                $('#Pkey_Form')
                        .addClass("form-horizontal")
                        .attr("onsubmit", "return Part2_Delete()");
                $.ajax({
                    type: "GET",
                    url: "P1.php",
                    data: 'p=PriKey&num=1&name=' + Table_Name,
                    success: function (msg) {
                        $('#Pkey_Form').append(msg);
                    }
                });
                break;
            default:
                break;
        }
    }
    else {
        $('#custom').html('<p class="To_Start">To ' + str + ', Please Select a Table to Start</p>');
    }
}

function Part2_Create() {
    var str = "INSERT INTO " + Table_Name + " VALUES (";
    $(".form-group div input").each(function () {
        if ($(this).attr('placeholder').indexOf('char') >= 0) {
            str += "'" + $(this).val() + "'";
        } else {
            str += $(this).val();
        }
        str += ",";
    });
    str = str.substr(0, str.length - 1);
    str += ")";
    $.ajax({
        type: "GET",
        url: "P1.php",
        data: 'p=Exec&name=' + str,
        success: function (msg) {
            if (msg === "Successful") {
                Show_Succ();
            }
            else {
                Err_Msg = msg;
                Show_Err();
            }
        }
    });
    $(".Nav_P2")[0].click();
    return false;
}

function Part2_Update() {
    //Generate structure form    
    Key_Name.splice(0,Key_Name.length);
    Key_Val.splice(0,Key_Val.length);
    $('#Pkey_Form label').each(function(){
        Key_Name.push($(this).html());
    });
    $('.form-group div input').each(function(){
        Key_Val.push($(this).val());
    });
    var str = 'SELECT * FROM ' + Table_Name + ' WHERE ';
    var i=0;
    while(i < Key_Name.length) {
        str += Key_Name[i] + '=' + Key_Val[i] + ' AND ';
        i += 1;
    };
    str=str.slice(0,-5);
    $('#custom')
            .html("")
            .append('<form class="form-horizontal" id="Update_Form" \n\
style="max-height:500px;overflow:auto"></form>');
    $.ajax({
        type: "GET",
        url: "P1.php",
        data: 'p=Update&table='+ Table_Name +'&sql=' + str,
        success: function (msg) {
            if (msg !== "Empty") {
                $('#Update_Form')
                    .attr("onsubmit", "return Part2_Update_Exec()")
                    .append(msg);
            }else{
                Err_Msg = "No Records";
                Show_Err();
                $(".Nav_P2")[2].click();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            alert(thrownError);
        }
    });
    return false;
}

function Part2_Update_Exec() {
    //new start
    var labels=[];
    $('.form-group label').each(function(){
        labels.push($(this).html());
    });
    str = "UPDATE " + Table_Name + " SET ";
    var i=0;
    $(".form-group div input").each(function () {
        str += labels[i] + '=';
        if ($(this).attr('placeholder').indexOf('char') >= 0) {
            str += "'" + $(this).val() + "'";
        } else {
            str += $(this).val();
        }
        str += ",";
        i+=1;
    });
    str = str.slice(0,-1);
    str += ' WHERE ';
    while(Key_Name.length > 0) {
        str += Key_Name.pop() + '=' + Key_Val.pop() + ' AND ';
    };
    str=str.slice(0,-5);
    $.ajax({
        type: "GET",
        url: "P1.php",
        data: 'p=Exec&name=' + str,
        success: function (msg) {
            if (msg === "Successful") {
                Show_Succ();
            }
            else {
                Err_Msg = msg;
                Show_Err();
            }
        }
    });
    $(".Nav_P2")[2].click();
    return false;
}

function Part2_Delete() {
    Key_Name.splice(0,Key_Name.length);
    Key_Val.splice(0,Key_Val.length);
    $('#Pkey_Form label').each(function(){
        Key_Name.push($(this).html());
    });
    $('.form-group div input').each(function(){
        Key_Val.push($(this).val());
    });
    var str = 'DELETE FROM ' + Table_Name + ' WHERE ';
    while(Key_Name.length > 0) {
        str += Key_Name.pop() + '=' + Key_Val.pop() + ' AND ';
    };
    str=str.slice(0,-5);
    $('#Input_Pkey').val("");
    $.ajax({
        type: "GET",
        url: "P1.php",
        data: 'p=Exec&name=' + str,
        success: function (msg) {
            if (msg === "Successful") {
                Show_Succ();
            }
            else {
                Err_Msg = msg;
                Show_Err();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(xhr.status);
            alert(thrownError);
        }
    });
    $(".Nav_P2")[3].click();
    return false;
}

function Part3_Click() {
    $('.col-md-9 h2').html("Solving Given Problems");
    $('.col-md-3 h2').html("Problems");
    $('#question').html("");
    $('#custom')
            .html("")
            .append('<p class="To_Start">Please Select a Problem to Start</p>');
    $('#result').html("");
    $('#Right_Side ul')
            .html("")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"1\">Prob 1</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"2\">Prob 2</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"3\">Prob 3</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"4\">Prob 4</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"5.1\">Prob 5.1</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"5.2\">Prob 5.2</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"5.3\">Prob 5.3</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"6.1\">Prob 6.1</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"6.2\">Prob 6.2</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"7\">Prob 7</a></li>")
            .append("<li><a href=\"#\" class=\"Part_3_Prob\" num=\"8\">Prob 8</a></li>");
    $('#Main_Page').fadeIn("Fast");
}

function Probs_Func(num) {
    $("#custom").html("");
    $("#result").html("");
    $("#Left_Side h2").html('Problem ' + num + ' ');
    //Show Problem Description
    switch (num) {
        case 1:
            $('#Left_Side h2').append("<span class='P_Des'>Find all products missing a product model number:<br>");
            break;
        case 2:
            $('#Left_Side h2').append("<span class='P_Des'>Find all products with price between 2 values \n\
that are taken as an input to the form:");
            break;
        case 3:
            $('#Left_Side h2').append("<span class='P_Des'>Find all products that need to be ordered:");
            break;
        case 4:
            $('#Left_Side h2').append("<span class='P_Des'>Find all products in Leather Laptop Cases category:");
            break;
        case 5.1:
            $('#Left_Side h2').append("<span class='P_Des'>Find all products that are Tote Bags:");
            break;
        case 5.2:
            $('#Left_Side h2').append("<span class='P_Des'>Find all customers without orders:");
            break;
        case 5.3:
            $('#Left_Side h2').append("<span class='P_Des'>Find all customers not in the US:");
            break;
        case 6.1:
            $('#Left_Side h2').append("<span class='P_Des'>Find all customer names and addresses for those \n\
customers with orders in pending status:");
            break;
        case 6.2:
            $('#Left_Side h2').append("<span class='P_Des'>Find the total shipping cost for orders that \n\
have been shipped to the US or United Kingdom:");
            break;
        case 7:
            $('#Left_Side h2').append("<span class='P_Des'>Find the total for all orders shipped to international destination:");
            break;
        case 8:
            $('#Left_Side h2').append("<span class='P_Des'>Write your own SQL query!");
            break;
        default:
            alert("Switch Error!");
    }
    //Deal Normal SQLs
    if (num !== 2 && num !== 8) {
        $.ajax({
            type: "GET",
            url: "P1.php",
            data: 'q=' + num,
            success: function (msg) {
                $('#result').html(msg);
            }
        });
    }
    if (num === 2) {
        $("#custom")
                .append('<form id="custom_form" class="form-horizontal"></form>');
        $("#custom_form")
                .attr("onsubmit", "return Prob2_Func()")
                .append('<div class="form-group">\n\
<label class="control-label col-md-2">From_Price:</label>\n\
<div class="col-md-3"><input type="number" class="form-control" id="from_price" placeholder="Input Price"></div>\n\
<label class="control-label col-md-1">TO_Price:</label>\n\
<div class="col-md-3"><input type=\"number\" class="form-control" id=\"to_price\" placeholder=\"Input Price\"></div>\n\
<input type="submit" class="btn btn-default"></div>');
    }
    if (num === 8) {
        $("#custom")
                .append('<form id="custom_form" ></form>');
        $("#custom_form")
                .attr("onsubmit", "return Prob8_Func()")
                .append('<div class="form-group"></div>');
        $(".form-group")
                .append('<input type="text" id="sql" class="form-control col-md-10 input-lg" \n\
placeholder="Input Your SQL Query" value="SELECT * FROM orders">')
                .append('<input type=\"submit\" class="btn btn-default form-control">');
    }
    $('#Left_Side').fadeIn("fast");
}

function Prob2_Func() {
    check = true;
    //check 1
    if ($('#from_price').val() !== "") {
        var num1 = $("#from_price").val();
    }
    else {
        $('#from_price').attr("placeholder", "No Price Here: P");
        check = false;
    }
    //check 2
    if ($('#to_price').val() !== "") {
        var num2 = $("#to_price").val();
    }
    else {
        $('#to_price').attr("placeholder", "No Price Here :P");
        check = false;
    }
    //if no price
    if (!check) {
        return false;
    }
    if (Number(num1) > Number(num2)) {
        alert("From_Price seems higher than To_Price :(");
        return false;
    }
    //check finished
    $('#from_price').attr("placeholder", "Input Price");
    $('#to_price').attr("placeholder", "Input Price");
    $.ajax({
        type: "GET",
        url: "P1.php",
        data: 'q=2&num1=' + num1 + "&num2=" + num2,
        success: function (msg) {
            $('#result').html(msg);
        }
    });
    return false;
}

function Prob8_Func() {
    var str = $("#sql").val();
    $.ajax({
        type: "GET",
        url: "P1.php",
        data: 'q=8&str=' + str,
        success: function (msg) {
            $('#result').html(msg);
        }
    });
    return false;
}

function Rand_Color() {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
}

function Show_Succ() {
    $('#Show').html('<div class="alert alert-success fade in">\n\
<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\n\
<strong>Success! -' + Date($.now()) + '</strong></div>');
}

function Show_Err() {
    $('#Show').html('<div class="alert alert-danger fade in">\n\
<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\n\
<strong>' + Err_Msg + '! -' + Date($.now()) + '</strong></div>');
}