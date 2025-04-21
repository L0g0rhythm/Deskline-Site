<?php

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$recipient_email = 'SEU_EMAIL_DE_RECEBIMENTO@exemplo.com';
$email_subject_prefix = '[Deskline Contato]';

$smtp_host = 'smtp.example.com';
$smtp_username = 'seu_email_de_envio@exemplo.com';
$smtp_password = 'SUA_SENHA_OU_APP_PASSWORD';
$smtp_port = 587;
$smtp_secure = PHPMailer::ENCRYPTION_STARTTLS;
$from_email = $smtp_username;
$from_name = 'Deskline Site';

function json_response($success, $message, $errors = []) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($success ? 200 : 400);
    echo json_encode(['success' => $success, 'message' => $message, 'errors' => $errors]);
    exit;
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrf_token = $_SESSION['csrf_token'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (empty($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        json_response(false, 'Erro de segurança (Token inválido). Recarregue a página e tente novamente.');
    }

    if (!empty($_POST['honeypot'])) {
        json_response(false, 'Spam detectado.');
    }

    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_SPECIAL_CHARS);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_SPECIAL_CHARS);

    $errors = [];
    if (empty($name)) {
        $errors['name'] = "Nome é obrigatório.";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Email inválido ou ausente.";
    }
    if (empty($message)) {
        $errors['message'] = "Mensagem é obrigatória.";
    }

    if (!empty($errors)) {
        json_response(false, 'Por favor, corrija os erros no formulário.', $errors);
    }

    $final_subject = trim($subject) ? $email_subject_prefix . ' ' . $subject : $email_subject_prefix . ' Mensagem do Site';

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = $smtp_host;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_username;
        $mail->Password   = $smtp_password;
        $mail->SMTPSecure = $smtp_secure;
        $mail->Port       = $smtp_port;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($from_email, $from_name);
        $mail->addAddress($recipient_email);
        $mail->addReplyTo($email, $name);

        $mail->isHTML(false);
        $mail->Subject = $final_subject;
        $mail->Body    = "Nome: {$name}\nEmail: {$email}\nAssunto: {$subject}\n\nMensagem:\n{$message}";
        $mail->send();
        json_response(true, 'Mensagem enviada com sucesso! Obrigado pelo contato.');

    } catch (Exception $e) {
        error_log("PHPMailer Error: {$mail->ErrorInfo}");
        json_response(false, "Erro ao enviar a mensagem. Por favor, tente novamente mais tarde ou use outro canal de contato.");
    }

} else {
    json_response(false, 'Método não permitido.');
}
