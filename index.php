<!DOCTYPE html>
<!--
CS425-Project-MainPage
-->
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Project Leather Store v2.1</title>
        <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <script type="text/javascript" src="./newjavascript.js?ver=2.1"></script>
        <link rel="stylesheet" href="./newcss.css?ver=1.1">
    </head>
    <body>
        <nav class="navbar navbar-inverse">
            <div class="container-fluid" id="Main_Nav">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span> 
                    </button>
                    <a class="navbar-brand active" id="edu" href="#">
                        <span class="glyphicon glyphicon-education" aria-hidden="true"></span>
                    </a>
                </div>
                <div class="collapse navbar-collapse" id="myNavbar">
                    <ul class="nav navbar-nav">
                        <li><a href="#" id="Nav_Part_1">Part 1</a></li>
                        <li><a href="#" id="Nav_Part_2">Part 2</a></li> 
                        <li><a href="#" id="Nav_Part_3">Part 3</a></li> 
                        <li><a href="./readme.html" id="Nav_Part_3">Read Me</a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#" id="Nav_Right" style="color:#F5F5F5">CS-425-Summer</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container-fluid" id="Main_Page">
            <div class="col-md-9" id="Left_Side">
                <h2><b>Thank you for using Project Leather Store</b></h2>
                <div id="question"></div>
                <div id="custom"></div>
                <div id="result"></div>
            </div>
            <div class="col-md-3" id="Right_Side">
                <h2></h2>
                <ul class="nav nav-pills nav-stacked" style="height:550px;overflow:auto">
                </ul>
            </div>
        </div>
    </body>
</html>
