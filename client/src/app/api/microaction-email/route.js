import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[char];
  });
}

export async function POST(request) {
  try {
    const {
      instanceId,
      microActionType,
      instruction,
      executionNotes,
      fileName,
      fullName,
      userEmail,
    } = await request.json();

    if (!instanceId) {
      return Response.json(
        { error: 'Falta el ID de la instancia de microacción.' },
        { status: 400 },
      );
    }

    const requiredEnv = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS',
      'MAIL_FROM',
      'MAIL_TO',
    ];

    const missingEnv = requiredEnv.filter((key) => !process.env[key]);

    if (missingEnv.length > 0) {
      console.error('Faltan variables SMTP:', missingEnv);

      return Response.json(
        { error: 'El servicio de correo no está configurado.' },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const details = {
      instanceId: escapeHtml(instanceId),
      microActionType: escapeHtml(microActionType || 'No especificado'),
      instruction: escapeHtml(instruction || 'Sin instrucciones'),
      executionNotes: escapeHtml(executionNotes || 'Sin notas de ejecución'),
      fileName: escapeHtml(fileName || 'Sin archivo'),
      fullName: escapeHtml(fullName || 'No especificado'),
      userEmail: escapeHtml(userEmail || 'No especificado'),
      uploadDate: new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
      }),
    };

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `Nueva microacción cargada: ${details.microActionType}`,
      text: `
Se cargó una nueva versión de una microacción en Colibrí OS.

ID de instancia: ${details.instanceId}
Tipo: ${details.microActionType}
Instrucciones: ${details.instruction}
Notas de ejecución: ${details.executionNotes}
Archivo: ${details.fileName}
Usuario: ${details.fullName}
Correo: ${details.userEmail}
Fecha: ${details.uploadDate}
      `,
      html: `
        <h2>Nueva microacción cargada</h2>
        <p>Se guardó una nueva versión de una microacción en Colibrí OS.</p>
        <table cellpadding="8" cellspacing="0" border="1"
          style="border-collapse:collapse;border-color:#ddd;">
          <tr>
            <td><strong>ID de instancia</strong></td>
            <td>${details.instanceId}</td>
          </tr>
          <tr>
            <td><strong>Tipo</strong></td>
            <td>${details.microActionType}</td>
          </tr>
          <tr>
            <td><strong>Instrucciones</strong></td>
            <td>${details.instruction}</td>
          </tr>
          <tr>
            <td><strong>Notas de ejecución</strong></td>
            <td>${details.executionNotes}</td>
          </tr>
          <tr>
            <td><strong>Archivo</strong></td>
            <td>${details.fileName}</td>
          </tr>
          <tr>
            <td><strong>Usuario</strong></td>
            <td>${details.fullName}</td>
          </tr>
          <tr>
            <td><strong>Usuario</strong></td>
            <td>${details.userEmail}</td>
          </tr>
          <tr>
            <td><strong>Fecha</strong></td>
            <td>${details.uploadDate}</td>
          </tr>
        </table>
      `,
    });

    return Response.json({
      success: true,
      message: 'Correo enviado correctamente.',
    });
  } catch (error) {
    console.error('Error enviando correo de microacción:', error);

    return Response.json(
      { error: 'No se pudo enviar el correo.' },
      { status: 500 },
    );
  }
}
