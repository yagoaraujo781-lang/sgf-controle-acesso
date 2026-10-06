const funcionarios = [
    { codigo: "FUNC001", nome: "João Silva", permitido: true },
    { codigo: "FUNC002", nome: "Maria Souza", permitido: true },
    { codigo: "FUNC003", nome: "Carlos Lima", permitido: false }
];

let historico = [];

function verificarAcesso() {
    const codigoInput = document.getElementById("codigo");
    const codigo = codigoInput.value.toUpperCase().trim();
    const resultado = document.getElementById("resultado");
    
    if (!codigo) {
        resultado.innerHTML = `<div class="negado">⚠️ Digite ou escaneie o código do crachá.</div>`;
        return;
    }

    const funcionario = funcionarios.find(p => p.codigo === codigo);

    if (!funcionario) {
        resultado.innerHTML = `<div class="negado">❌ Crachá não encontrado.</div>`;
        adicionarHistorico("Desconhecido", codigo, "NEGADO");
        return;
    }

    if (funcionario.permitido) {
        resultado.innerHTML = `
            <div class="autorizado">
                <strong>✅ ACESSO AUTORIZADO</strong>
                <br><br>
                Funcionário: ${funcionario.nome}
                <br>
                Crachá: ${funcionario.codigo}
            </div>
        `;
        adicionarHistorico(funcionario.nome, funcionario.codigo, "AUTORIZADO");
    } else {
        resultado.innerHTML = `
            <div class="negado">
                <strong>❌ ACESSO NEGADO</strong>
                <br><br>
                Funcionário: ${funcionario.nome}
                <br>
                Motivo: sem permissão de acesso.
            </div>
        `;
        adicionarHistorico(funcionario.nome, funcionario.codigo, "NEGADO");
    }
    
    // Limpa o input e mantém o foco para o próximo crachá
    codigoInput.value = "";
    codigoInput.focus();
}

function adicionarHistorico(nome, codigo, status) {
    const agora = new Date();
    const horario = agora.toLocaleTimeString("pt-BR");
    historico.unshift({ nome, codigo, status, horario }); // Adiciona no topo
    atualizarHistorico();
}

function atualizarHistorico() {
    const historicoDiv = document.getElementById("historico");

    if (historico.length === 0) {
        historicoDiv.innerHTML = "<p>Nenhum acesso realizado ainda.</p>";
        return;
    }

    historicoDiv.innerHTML = historico.map(a => `
        <div class="acesso">
            <strong>${a.nome}</strong> - ${a.codigo} - 
            <span style="color: ${a.status === 'AUTORIZADO' ? '#166534' : '#991b1b'}; font-weight: bold;">${a.status}</span> 
            - ${a.horario}
        </div>
    `).join("");
}

// === ATALHOS DE TECLADO AUTOMATIZADOS ===
document.addEventListener("DOMContentLoaded", () => {
    const inputCodigo = document.getElementById("codigo");
    
    // Foca automaticamente no input ao abrir a página
    inputCodigo.focus();

    inputCodigo.addEventListener("keydown", function(event) {
        // Atalho: Enter dispara a verificação de acesso
        if (event.key === "Enter") {
            event.preventDefault();
            verificarAcesso();
        }
    });

    // Atalho global: Tecla ESC limpa o campo de entrada e o resultado atual
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            inputCodigo.value = "";
            document.getElementById("resultado").innerHTML = "";
            inputCodigo.focus();
        }
    });
});
