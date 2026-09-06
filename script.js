const funcionarios = [
    {
        codigo: "FUNC001",
        nome: "João Silva",
        permitido: true
    },
    {
        codigo: "FUNC002",
        nome: "Maria Souza",
        permitido: true
    },
    {
        codigo: "FUNC003",
        nome: "Carlos Lima",
        permitido: false
    }
];

let historico = [];


function verificarAcesso() {

    const codigo = document
        .getElementById("codigo")
        .value
        .toUpperCase()
        .trim();

    const resultado = document.getElementById("resultado");

    const funcionario = funcionarios.find(
        pessoa => pessoa.codigo === codigo
    );


    if (!funcionario) {

        resultado.innerHTML = `
            <div class="negado">
                ❌ Crachá não encontrado.
            </div>
        `;

        adicionarHistorico(
            "Desconhecido",
            codigo,
            "NEGADO"
        );

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

        adicionarHistorico(
            funcionario.nome,
            funcionario.codigo,
            "AUTORIZADO"
        );

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

        adicionarHistorico(
            funcionario.nome,
            funcionario.codigo,
            "NEGADO"
        );
    }
}


function adicionarHistorico(nome, codigo, status) {

    const agora = new Date();

    const horario = agora.toLocaleTimeString("pt-BR");

    historico.push({
        nome: nome,
        codigo: codigo,
        status: status,
        horario: horario
    });

    atualizarHistorico();
}


function atualizarHistorico() {

    const historicoDiv =
        document.getElementById("historico");

    if (historico.length === 0) {

        historicoDiv.innerHTML =
            "<p>Nenhum acesso realizado ainda.</p>";

        return;
    }


    historicoDiv.innerHTML = historico
        .map(acesso => {

            return `
                <div class="acesso">

                    <strong>${acesso.nome}</strong>

                    - ${acesso.codigo}

                    - ${acesso.status}

                    - ${acesso.horario}

                </div>
            `;

        })
        .join("");
}
