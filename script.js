const API_URL = 'http://localhost:3000/api';
const form = document.getElementById('form-checkin');
const inputCodigo = document.getElementById('input-codigo');
const resultadoCard = document.getElementById('resultado-card');
const tabelaHistorico = document.getElementById('tabela-historico');
const statusConexao = document.getElementById('status-conexao');
const btnCamera = document.getElementById('btn-camera');
const qrReaderDiv = document.getElementById('qr-reader');

const MOCK_DB = {
  FUNC001: { nome: 'João Silva', cargo: 'Engenheiro Civil', ativo: true },
  FUNC002: { nome: 'Maria Souza', cargo: 'Mestre de Obras', ativo: true },
  FUNC003: { nome: 'Carlos Lima', cargo: 'Eletricista', ativo: false }
};

let apiOnline = false;
let html5QrCode = null;
let cameraAtiva = false;

async function checarApi() {
  try {
    const res = await fetch(`${API_URL}/historico`);
    if (res.ok) {
      apiOnline = true;
      statusConexao.textContent = 'API Backend + Banco 3FN Conectados';
      statusConexao.className = 'badge-online';
      const rows = await res.json();
      tabelaHistorico.innerHTML = '';
      rows.reverse().forEach((r) => {
        adicionarLinhaTabela(
          new Date(r.data_hora).toLocaleTimeString('pt-BR'),
          r.codigo_cracha_lido,
          r.nome,
          r.resultado,
          r.motivo_ocorrencia
        );
      });
    }
  } catch {
    apiOnline = false;
    statusConexao.textContent = 'Modo Local (Fallback sem Backend)';
    statusConexao.className = 'badge-offline';
  }
}

async function processarCheckin(codigoBruto) {
  const codigo = codigoBruto.trim().toUpperCase();
  if (!codigo) return;

  if (apiOnline) {
    const res = await fetch(`${API_URL}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo })
    });
    const dados = await res.json();
    exibirFeedback(dados.resultado, `${dados.nome} (${dados.cargo}) — ${dados.motivo}`);
    adicionarLinhaTabela(dados.data_hora, dados.codigo, dados.nome, dados.resultado, dados.motivo);
  } else {
    const func = MOCK_DB[codigo];
    const hora = new Date().toLocaleTimeString('pt-BR');
    if (func && func.ativo) {
      exibirFeedback('AUTORIZADO', `${func.nome} (${func.cargo}) — Acesso liberado.`);
      adicionarLinhaTabela(hora, codigo, func.nome, 'AUTORIZADO', 'Validado localmente');
    } else {
      const motivo = func ? 'Crachá suspenso.' : 'Crachá não encontrado.';
      exibirFeedback('NEGADO', `${func ? func.nome : 'Desconhecido'} — ${motivo}`);
      adicionarLinhaTabela(hora, codigo, func ? func.nome : 'Desconhecido', 'NEGADO', motivo);
    }
  }

  inputCodigo.value = '';
  inputCodigo.focus();
}

function exibirFeedback(status, mensagem) {
  resultadoCard.textContent = `${status}: ${mensagem}`;
  resultadoCard.className = `resultado ${status === 'AUTORIZADO' ? 'autorizado' : 'negado'}`;
}

function adicionarLinhaTabela(hora, codigo, nome, status, obs) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${hora}</td>
    <td><strong>${codigo}</strong></td>
    <td>${nome}</td>
    <td style="color: ${status === 'AUTORIZADO' ? '#166534' : '#991b1b'}; font-weight: 700;">${status}</td>
    <td>${obs}</td>
  `;
  tabelaHistorico.prepend(tr);
}

btnCamera.addEventListener('click', async () => {
  if (!cameraAtiva) {
    qrReaderDiv.style.display = 'block';
    html5QrCode = new Html5Qrcode('qr-reader');
    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          processarCheckin(decodedText);
          html5QrCode.pause(true);
          setTimeout(() => html5QrCode.resume(), 2000);
        }
      );
      cameraAtiva = true;
      btnCamera.textContent = 'Desativar Câmera';
    } catch (err) {
      alert('Não foi possível acessar a câmera: ' + err);
      qrReaderDiv.style.display = 'none';
    }
  } else {
    await html5QrCode.stop();
    qrReaderDiv.style.display = 'none';
    cameraAtiva = false;
    btnCamera.textContent = 'Ativar Câmera QR Code';
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  processarCheckin(inputCodigo.value);
});

document.getElementById('btn-limpar').addEventListener('click', () => {
  inputCodigo.value = '';
  resultadoCard.className = 'resultado oculto';
  inputCodigo.focus();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('btn-limpar').click();
  }
});

checarApi();
