<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$return = "";
//Connect
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "CS425";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//Switch SQLs
if (isset($_REQUEST["q"]) && !empty($_REQUEST["q"])) {
    $q = $_REQUEST["q"];
    switch ($q) {
        case "1":
            $sql = "SELECT * FROM products WHERE products_model=''";
            break;
        case "2":
            $num1 = $_REQUEST["num1"];
            $num2 = $_REQUEST["num2"];
            $sql = "SELECT * FROM `products` WHERE products_price>=$num1 "
                    . "AND products_price<=$num2";
            break;
        case "3":
            $sql = "SELECT * FROM `products` WHERE products_quantity<=2";
            break;
        case "4":
            $sql = "SELECT * FROM `products_to_categories` WHERE categories_id "
                . "IN (SELECT categories_id FROM `categories_description` WHERE categories_name LIKE '%Leather Laptop Cases%')";
            break;
        case "5.1":
            $sql = "SELECT * FROM `products_to_categories` WHERE categories_id "
                . "IN (SELECT categories_id FROM `categories_description` WHERE categories_name LIKE '%Tote Bags%')";
            break;
        case "5.2":
            $sql = "SELECT * FROM `customers` WHERE customers_id NOT IN "
                . "(SELECT customers_id FROM `orders`)";
            break;
        case "5.3":
            $sql = "SELECT * FROM `customers` WHERE customers_id IN "
                . "(SELECT customers_id FROM `orders` WHERE customers_country<>'United States')";
            break;
        case "6.1":
            $sql = "SELECT DISTINCT customers_name,customers_street_address "
                . "FROM `orders` WHERE orders_status IN "
                . "(SELECT orders_status_id FROM `orders_status` WHERE orders_status_name='Pending')";
            break;
        case "6.2":
            $sql = "SELECT sum(shipping_cost) FROM `orders` "
                . "WHERE delivery_country='United States' OR delivery_country='United Kingdom'";
            break;
        case "7":
            $sql = "SELECT sum(shipping_cost) FROM `orders` WHERE delivery_country<>'United States'";
            break;
        case "8":
            $sql = $_REQUEST["str"];
            break;
        default:
            echo "Switch Error";
            return false;
    }
    $result = $conn->query($sql);
    //$return = $sql;
    if ($result->num_rows > 0) {
        //generate head
        $return .= "<div class=\"table-responsive\" style=\"max-height:500px;overflow:auto\">";
        $return .= "<table id=\"result_table\" class=\"table table-striped table-bordered table-condensed\"><thead><tr>";
        while ($fieldinfo = mysqli_fetch_field($result)) {
            $return .= "<th>" . $fieldinfo->name . "</th>";
        }
        $return .= '</tr></thead><tbody id="fbody">';
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            $return .= "<tr>";
            foreach ($row as $x => $x_value) {
                $return .= "<td>$x_value</td>";
            }
            $return .= "</tr>";
        }
        $return .= "</tbody></table></div>";
    } else {
        $return .= "0 results";
    }
}

if (isset($_REQUEST["p"]) && !empty($_REQUEST["p"])) {
    $p=$_REQUEST["p"];
    switch ($p) {
        case "RightGetTables":
            $sql = "SHOW TABLES;";
            $result = $conn->query($sql);
            while ($row = $result->fetch_assoc()) {
                $return .= "<li><a href=\"#\" class=\"Right_Tables\">";
                foreach ($row as $x => $x_value) {
                    $return .= "$x_value";
                }
                $return .= "</a></li>";
            }
            break;
        case "Create":
            $sql="Describe ".$_REQUEST["name"];
            $result = $conn->query($sql);
            while ($row = $result->fetch_assoc()) {
                $return .= "<div class=\"form-group\">";
                foreach ($row as $x => $x_value) {
                    if ($x == "Field") {
                        $return .= "<label class=\"control-label col-md-4\">" . $x_value . "</label>";
                    } else {
                        if ($x == "Type") {
                            $return .= "<div class=\"col-md-7\">"
                                    . "<input type=\"text\" class=\"form-control\" placeholder=\"" . $x_value . "\"></div>";
                        }
                    }
                }
                $return .= "</div>";
            }
            $return .= "</div><input type=\"submit\" class=\"btn btn-default form-control\" value=\"Insert\">";
            break;
        case "PriKey":
            $sql = "SHOW KEYS FROM " . $_REQUEST["name"] . " WHERE Key_name = 'PRIMARY'";
            $num = $_REQUEST["num"];
            switch ($num){
                case 0:
                    $str='Search';
                    break;
                case 1:
                    $str = 'Search&Delete';
                    break;
                default:
                    $str='';
                    break;
            }
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $return .= "<div class=\"form-group\">";
                while ($row = $result->fetch_assoc()) {
                    foreach ($row as $x => $x_value) {
                        if ($x == "Column_name") {
                            $return .= "<label class=\"control-label col-md-3\">" . $x_value . "</label>";
                            $return .= '<div class="col-md-7">'
                        . '<input type="text" class="form-control" '
                        . 'placeholder="Please enter the key of the record you want to operate"></div>';
                        }
                    }
                }
                $return .= '<input type="submit" class="btn btn-default" ';
                if ($str!=''){
                    $return .= 'value="' . $str . '"';
                }
                $return .= '></div>';
            } else {
                $return = 'No Primary Key!';
            }
            break;
        case "Update":
            $sql1="Describe ".$_REQUEST["table"];
            $result1 = $conn->query($sql1);
            $types = array();
            $names = array();
            $i=0;
            $hasrow = false;
            while ($row = $result1->fetch_assoc()) {
                foreach ($row as $x => $x_value) {
                    if ($x == "Type") {
                        $types[] = $x_value;
                        }
                    }
            }
            $sql = $_REQUEST["sql"];
            $result = $conn->query($sql);
            while ($fieldinfo = mysqli_fetch_field($result)) {
                $names[] = $fieldinfo->name;
            }
            while ($row = $result->fetch_assoc()) {
                $hasrow = true;
                foreach ($row as $x => $x_value) {
                    $return .= "<div class=\"form-group\">";
                    $return .= "<label class=\"control-label col-md-4\">" . $names[$i] . "</label>";
                    $return .= "<div class=\"col-md-7\">"
                            . "<input type=\"text\" class=\"form-control\" placeholder=\"".$types[$i]."\" value=\"" . $x_value . "\"></div>";
                    $return .= "</div>";
                    $i+=1;
                }
            }
            if (!$hasrow){
                echo "Empty";
                return false;
            }
            $return .= "</div><input type=\"submit\" class=\"btn btn-default form-control\">";
            break;
        case "Exec":
            $sql = $_REQUEST["name"];
            $result = $conn->query($sql);
            if ($conn->affected_rows > 0) {
                $return = "Successful";
            } else {
                if ($conn->error){
                    $return = "Error: " . $conn->error;
                }else{
                    $return = "Error: No Affect";
                }
            }
            break;
        default:
            echo "Switch Error";
            return false;
    }
}
$conn->close();
echo $return;