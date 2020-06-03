import Knex from "knex"

export async function seed(knex: Knex) {
    await knex('itens').insert([
        {title: 'Lâmpadas', image:'lampadas.svg'},
        {title: 'Pilha e baterias', image:'baterias.svg'},
        {title: 'Papéis e Papelão', image:'papeis-papelao.svg'},
        {title: 'Residuos Eletrônicos', image:'eletronicos.svg'},
        {title: 'Residuos Orgânicos', image:'organicos.svg'},
        {title: 'Óleo de Cozihna', image:'oleo.svg'},
    ]);
}