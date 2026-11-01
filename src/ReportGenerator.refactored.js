const PRIORITY_THRESHOLD = 1000;
const USER_MAX_VISIBLE_VALUE = 500;

/**
 * Regras de visibilidade e prioridade de cada perfil de usuário.
 */
const ROLE_POLICIES = {
  ADMIN: {
    canSee: () => true,
    isPriority: (item) => item.value > PRIORITY_THRESHOLD,
  },
  USER: {
    canSee: (item) => item.value <= USER_MAX_VISIBLE_VALUE,
    isPriority: () => false,
  },
};

const NO_ACCESS_POLICY = {
  canSee: () => false,
  isPriority: () => false,
};

/**
 * Formatação de cada tipo de relatório (cabeçalho, linhas e rodapé).
 */
class CsvFormatter {
  header() {
    return ['ID,NOME,VALOR,USUARIO'];
  }

  row(item, user) {
    return `${item.id},${item.name},${item.value},${user.name}`;
  }

  footer(total) {
    return ['', 'Total,,', `${total},,`];
  }
}

class HtmlFormatter {
  header(user) {
    return [
      '<html><body>',
      '<h1>Relatório</h1>',
      `<h2>Usuário: ${user.name}</h2>`,
      '<table>',
      '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>',
    ];
  }

  row(item, user, isPriority) {
    const style = isPriority ? ' style="font-weight:bold;"' : '';
    return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>`;
  }

  footer(total) {
    return ['</table>', `<h3>Total: ${total}</h3>`, '</body></html>'];
  }
}

const FORMATTERS = {
  CSV: new CsvFormatter(),
  HTML: new HtmlFormatter(),
};

export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  /**
   * Gera um relatório de itens baseado no tipo e no usuário.
   * - Admins veem tudo.
   * - Users comuns só veem itens com valor <= 500.
   */
  generateReport(reportType, user, items) {
    const formatter = FORMATTERS[reportType];
    if (!formatter) {
      return '';
    }

    const policy = ROLE_POLICIES[user.role] ?? NO_ACCESS_POLICY;
    const visibleItems = items.filter((item) => policy.canSee(item));

    const lines = [
      ...formatter.header(user),
      ...this.buildRows(formatter, policy, user, visibleItems),
      ...formatter.footer(this.calculateTotal(visibleItems)),
    ];

    return lines.join('\n').trim();
  }

  buildRows(formatter, policy, user, items) {
    return items.map((item) => formatter.row(item, user, policy.isPriority(item)));
  }

  calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.value, 0);
  }
}
