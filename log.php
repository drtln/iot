<?php
include("db.php");

session_start();

$Uname=$_POST['txtuname'];

$Pwd=$_POST['txtpwd'];

$result = mysql_query("select  * from  userlog  where  id='$Uname'  and  pwd= '$Pwd' ");

 if(mysql_num_rows($result) > 0)
 {
      $_SESSION['U_name'] = $Uname;
      header("location: aliettable.php");
 }
 else
 {
     header("location: alietlog.html");
 }


?>