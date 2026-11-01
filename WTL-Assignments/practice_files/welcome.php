<?php
    $servername="localhost";
    $username="root";
    $password="Gayu@2405";
    $database="std";

    $conn=mysqli_connect($servername,$username,$password,$database);

    if(!$conn){
        die("Connection failed: ". mysqli_connect_error());
    }

    $name=$_POST['name'];
    $prn=$_POST['prn'];
    
    $sql="INSERT INTO student(name,prn) VALUES('$name','$prn')";

    if(mysqli_query($conn,$sql)){
        echo "Record Inserted Successfully";
    }else{
        echo "Error :",mysqli_error($conn);
    }
    mysqli_close($conn);
?>