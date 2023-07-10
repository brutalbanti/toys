<?php

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Функция для отправки электронной почты
function sendEmail($email, $message)
{
    $mail = new PHPMailer(true);

    try {
        // Конфигурация SMTP сервера
        $mail->isSMTP();
        $mail->Host       = 'smtp.example.com'; // Укажите адрес SMTP сервера
        $mail->SMTPAuth   = true;
        $mail->Username   = 'your_username';    // Укажите имя пользователя SMTP сервера
        $mail->Password   = 'your_password';    // Укажите пароль SMTP сервера
        $mail->SMTPSecure = 'tls';               // Используйте 'tls' или 'ssl', в зависимости от настроек вашего сервера
        $mail->Port       = 587;                 // Укажите порт SMTP сервера

        // Отправитель и получатель
        $mail->setFrom('medicalgold.com@gmail.com', 'From Name');  // Укажите адрес отправителя и имя отправителя
        $mail->addAddress($email);                        // Укажите адрес получателя

        // Тема и тело письма
        $mail->Subject = 'Новый заказ';
        $mail->Body    = $message;

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

// Получение данных из запроса
$data = json_decode(file_get_contents('php://input'), true);

// Извлечение данных о заказе
$selectedItems = $data['selectedItems'];
$email = 'medicalgold.com@gmail.com';
$phoneNumber = $data['phoneNumber'];
$firstName = $data['firstName'];
$lastName = $data['lastName'];
$middleName = $data['middleName'];
$region = $data['region'];
$city = $data['city'];
$postOffice = $data['postOffice'];

// Генерация HTML для выбранных товаров
$message = '<h1>Выбранные товары:</h1>';
$message .= '<ul>';

$totalPrice = 0; // Общая цена заказа

foreach ($selectedItems as $item) {
    $price = $item['price'];
    $photo = $item['photo'];
    $name = $item['name'];

    $message .= '<li>';
    $message .= '<img src="' . $photo . '" alt="' . $name . '">';
    $message .= '<h2>' . $name . '</h2>';
    $message .= '<p>Цена: ' . $price . '</p>';
    $message .= '</li>';

    $totalPrice += $price;
}

$message .= '</ul>';
$message .= '<p>Общая цена: ' . $totalPrice . '</p>';
$message .= '<p>Имя: ' . $firstName . '</p>';
$message .= '<p>Фамилия: ' . $lastName . '</p>';
$message .= '<p>Отчество: ' . $middleName . '</p>';
$message .= '<p>Номер телефона: ' . $phoneNumber . '</p>';
$message .= '<p>Область: ' . $region . '</p>';
$message .= '<p>Город: ' . $city . '</p>';
$message .= '<p>Отделение Новой Почты: ' . $postOffice . '</p>';

// Отправка электронной почты
$result = sendEmail($email, $message);

if ($result) {
    echo 'Email sent successfully';
} else {
    echo 'Email sending failed';
}
