import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Definição das 14 tabelas do banco de dados
const TABELAS = [
  {
    id: 'aluno',
    nome: 'Aluno',
    tabela: 'aluno',
    icone: 'people',
    cor: '#2563EB',
    campos: [
      { key: 'nome', label: 'Nome Completo', placeholder: 'Ex: Maria Silva', obrigatorio: true },
      { key: 'matricula', label: 'Matrícula', placeholder: 'Ex: 2026001', obrigatorio: true },
      { key: 'email', label: 'E-mail', placeholder: 'Ex: maria@escola.com' },
      { key: 'data_nascimento', label: 'Data de Nascimento', placeholder: 'Ex: 15/05/2008' },
      { key: 'status', label: 'Status', placeholder: 'Ex: Ativo' },
    ],
  },
  {
    id: 'aluno_responsavel',
    nome: 'Aluno x Responsável',
    tabela: 'aluno_responsavel',
    icone: 'git-network',
    cor: '#7C3AED',
    campos: [
      { key: 'aluno_nome', label: 'Nome do Aluno', placeholder: 'Ex: Maria Silva', obrigatorio: true },
      { key: 'responsavel_nome', label: 'Nome do Responsável', placeholder: 'Ex: Carlos Silva', obrigatorio: true },
      { key: 'parentesco', label: 'Parentesco', placeholder: 'Ex: Pai / Mãe / Tutor' },
    ],
  },
  {
    id: 'avaliacao',
    nome: 'Avaliação',
    tabela: 'avaliacao',
    icone: 'document-text',
    cor: '#0891B2',
    campos: [
      { key: 'titulo', label: 'Título da Avaliação', placeholder: 'Ex: Prova Bimestral 1', obrigatorio: true },
      { key: 'disciplina', label: 'Disciplina', placeholder: 'Ex: Matemática', obrigatorio: true },
      { key: 'data', label: 'Data', placeholder: 'Ex: 20/04/2026' },
      { key: 'peso', label: 'Peso', placeholder: 'Ex: 10.0' },
    ],
  },
  {
    id: 'boletim',
    nome: 'Boletim',
    tabela: 'boletim',
    icone: 'reader',
    cor: '#059669',
    campos: [
      { key: 'aluno_nome', label: 'Aluno', placeholder: 'Ex: Maria Silva', obrigatorio: true },
      { key: 'periodo', label: 'Período / Bimestre', placeholder: 'Ex: 1º Bimestre 2026', obrigatorio: true },
      { key: 'media_geral', label: 'Média Geral', placeholder: 'Ex: 8.7' },
      { key: 'situacao', label: 'Situação', placeholder: 'Ex: Aprovado' },
    ],
  },
  {
    id: 'coordenador',
    nome: 'Coordenador',
    tabela: 'coordenador',
    icone: 'shield-checkmark',
    cor: '#D97706',
    campos: [
      { key: 'nome', label: 'Nome do Coordenador', placeholder: 'Ex: Prof. Roberto Lima', obrigatorio: true },
      { key: 'area', label: 'Área / Setor', placeholder: 'Ex: Ensino Médio', obrigatorio: true },
      { key: 'email', label: 'E-mail', placeholder: 'Ex: roberto@escola.com' },
      { key: 'telefone', label: 'Telefone', placeholder: 'Ex: (11) 99999-0000' },
    ],
  },
  {
    id: 'curso',
    nome: 'Curso',
    tabela: 'curso',
    icone: 'school',
    cor: '#4F46E5',
    campos: [
      { key: 'nome', label: 'Nome do Curso', placeholder: 'Ex: Ensino Médio Técnico', obrigatorio: true },
      { key: 'carga_horaria', label: 'Carga Horária', placeholder: 'Ex: 1200h' },
      { key: 'turno', label: 'Turno', placeholder: 'Ex: Matutino' },
    ],
  },
  {
    id: 'cursos',
    nome: 'Cursos (Catálogo)',
    tabela: 'cursos',
    icone: 'library',
    cor: '#6366F1',
    campos: [
      { key: 'titulo', label: 'Título do Curso', placeholder: 'Ex: Desenvolvimento de Sistemas', obrigatorio: true },
      { key: 'modalidade', label: 'Modalidade', placeholder: 'Ex: Presencial / EAD', obrigatorio: true },
      { key: 'duracao', label: 'Duração', placeholder: 'Ex: 3 Semestres' },
      { key: 'vagas', label: 'Vagas', placeholder: 'Ex: 40' },
    ],
  },
  {
    id: 'disciplina',
    nome: 'Disciplina',
    tabela: 'disciplina',
    icone: 'book',
    cor: '#0D9488',
    campos: [
      { key: 'nome', label: 'Nome da Disciplina', placeholder: 'Ex: Banco de Dados', obrigatorio: true },
      { key: 'codigo', label: 'Código', placeholder: 'Ex: BD-101', obrigatorio: true },
      { key: 'carga_horaria', label: 'Carga Horária', placeholder: 'Ex: 80h' },
      { key: 'professor', label: 'Professor Responsável', placeholder: 'Ex: Ana Paula' },
    ],
  },
  {
    id: 'frequencia',
    nome: 'Frequência',
    tabela: 'frequencia',
    icone: 'calendar',
    cor: '#E11D48',
    campos: [
      { key: 'aluno_nome', label: 'Aluno', placeholder: 'Ex: Maria Silva', obrigatorio: true },
      { key: 'disciplina', label: 'Disciplina', placeholder: 'Ex: Banco de Dados', obrigatorio: true },
      { key: 'data', label: 'Data da Aula', placeholder: 'Ex: 19/11/2026' },
      { key: 'status', label: 'Presença', placeholder: 'Ex: Presente / Falta' },
    ],
  },
  {
    id: 'matricula',
    nome: 'Matrícula',
    tabela: 'matricula',
    icone: 'id-card',
    cor: '#2563EB',
    campos: [
      { key: 'numero', label: 'Nº da Matrícula', placeholder: 'Ex: MAT-2026-089', obrigatorio: true },
      { key: 'aluno_nome', label: 'Aluno', placeholder: 'Ex: Maria Silva', obrigatorio: true },
      { key: 'turma', label: 'Turma', placeholder: 'Ex: 3º Ano A' },
      { key: 'data_matricula', label: 'Data', placeholder: 'Ex: 10/02/2026' },
    ],
  },
  {
    id: 'nota',
    nome: 'Nota',
    tabela: 'nota',
    icone: 'ribbon',
    cor: '#16A34A',
    campos: [
      { key: 'aluno_nome', label: 'Aluno', placeholder: 'Ex: Maria Silva', obrigatorio: true },
      { key: 'avaliacao', label: 'Avaliação', placeholder: 'Ex: Prova Bimestral 1', obrigatorio: true },
      { key: 'valor', label: 'Nota Obtida', placeholder: 'Ex: 9.5', obrigatorio: true },
      { key: 'observacao', label: 'Observação', placeholder: 'Ex: Excelente desempenho' },
    ],
  },
  {
    id: 'professor',
    nome: 'Professor',
    tabela: 'professor',
    icone: 'person-circle',
    cor: '#9333EA',
    campos: [
      { key: 'nome', label: 'Nome do Professor', placeholder: 'Ex: Prof. Ana Paula', obrigatorio: true },
      { key: 'especialidade', label: 'Especialidade', placeholder: 'Ex: Engenharia de Software', obrigatorio: true },
      { key: 'email', label: 'E-mail', placeholder: 'Ex: ana@escola.com' },
      { key: 'telefone', label: 'Telefone', placeholder: 'Ex: (11) 98888-1111' },
    ],
  },
  {
    id: 'responsavel',
    nome: 'Responsável',
    tabela: 'responsavel',
    icone: 'heart',
    cor: '#DB2777',
    campos: [
      { key: 'nome', label: 'Nome do Responsável', placeholder: 'Ex: Carlos Silva', obrigatorio: true },
      { key: 'cpf', label: 'CPF', placeholder: 'Ex: 123.456.789-00' },
      { key: 'telefone', label: 'Telefone', placeholder: 'Ex: (11) 97777-2222', obrigatorio: true },
      { key: 'email', label: 'E-mail', placeholder: 'Ex: carlos@email.com' },
    ],
  },
  {
    id: 'turma',
    nome: 'Turma',
    tabela: 'turma',
    icone: 'albums',
    cor: '#EA580C',
    campos: [
      { key: 'nome', label: 'Nome da Turma', placeholder: 'Ex: 3º Ano A', obrigatorio: true },
      { key: 'curso', label: 'Curso', placeholder: 'Ex: Desenvolvimento de Sistemas', obrigatorio: true },
      { key: 'ano_letivo', label: 'Ano Letivo', placeholder: 'Ex: 2026' },
      { key: 'sala', label: 'Sala', placeholder: 'Ex: Sala 12' },
    ],
  },
];

// Dados iniciais baseados na imagem do seu banco (1 aluno + 2 cursos + exemplos)
const DADOS_INICIAIS = {
  aluno: [
    {
      id: '1',
      nome: 'Maria Eduarda Silva',
      matricula: '2026001',
      email: 'maria.silva@scholar.edu',
      data_nascimento: '14/03/2008',
      status: 'Ativo',
    },
  ],
  aluno_responsavel: [],
  avaliacao: [],
  boletim: [],
  coordenador: [],
  curso: [],
  cursos: [
    {
      id: '1',
      titulo: 'Desenvolvimento de Sistemas',
      modalidade: 'Presencial',
      duracao: '3 Semestres',
      vagas: '40',
    },
    {
      id: '2',
      titulo: 'Administração Integrada',
      modalidade: 'Híbrido',
      duracao: '4 Semestres',
      vagas: '35',
    },
  ],
  disciplina: [],
  frequencia: [],
  matricula: [],
  nota: [],
  professor: [],
  responsavel: [],
  turma: [],
};

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('dashboard'); // 'dashboard' ou id da tabela
  const [dados, setDados] = useState(DADOS_INICIAIS);
  const [busca, setBusca] = useState('');

  // Estados do Modal de Adicionar / Editar
  const [modalFormVisivel, setModalFormVisivel] = useState(false);
  const [itemEditando, setItemEditando] = useState(null);
  const [formValores, setFormValores] = useState({});
  const [erroForm, setErroForm] = useState('');

  // Estado do Modal de Confirmação de Exclusão
  const [itemExcluindo, setItemExcluindo] = useState(null);

  const tabelaAtual = useMemo(
    () => TABELAS.find((t) => t.id === abaAtiva),
    [abaAtiva]
  );

  const totalRegistros = useMemo(
    () => Object.values(dados).reduce((acc, lista) => acc + lista.length, 0),
    [dados]
  );

  const registrosFiltrados = useMemo(() => {
    if (!tabelaAtual) return [];
    const lista = dados[tabelaAtual.id] || [];
    if (!busca.trim()) return lista;
    const termo = busca.toLowerCase();
    return lista.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(termo)
      )
    );
  }, [dados, tabelaAtual, busca]);

  // Abrir modal para ADICIONAR
  const abrirAdicionar = () => {
    setItemEditando(null);
    setFormValores({});
    setErroForm('');
    setModalFormVisivel(true);
  };

  // Abrir modal para EDITAR
  const abrirEditar = (item) => {
    setItemEditando(item);
    setFormValores({ ...item });
    setErroForm('');
    setModalFormVisivel(true);
  };

  // Salvar (Adicionar ou Editar)
  const salvarRegistro = () => {
    if (!tabelaAtual) return;
    const campoFaltando = tabelaAtual.campos.find(
      (c) => c.obrigatorio && !String(formValores[c.key] || '').trim()
    );
    if (campoFaltando) {
      setErroForm(`O campo "${campoFaltando.label}" é obrigatório.`);
      return;
    }

    setDados((prev) => {
      const listaAtual = prev[tabelaAtual.id] || [];
      if (itemEditando) {
        return {
          ...prev,
          [tabelaAtual.id]: listaAtual.map((reg) =>
            reg.id === itemEditando.id ? { ...formValores, id: reg.id } : reg
          ),
        };
      } else {
        const novoItem = {
          ...formValores,
          id: String(Date.now()),
        };
        return {
          ...prev,
          [tabelaAtual.id]: [novoItem, ...listaAtual],
        };
      }
    });

    setModalFormVisivel(false);
    setItemEditando(null);
    setFormValores({});
  };

  // Confirmar EXCLUSÃO
  const confirmarExclusao = () => {
    if (!tabelaAtual || !itemExcluindo) return;
    setDados((prev) => ({
      ...prev,
      [tabelaAtual.id]: (prev[tabelaAtual.id] || []).filter(
        (reg) => reg.id !== itemExcluindo.id
      ),
    }));
    setItemExcluindo(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      {/* Cabeçalho Principal */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Ionicons name="school" size={22} color="#1E3A8A" />
            </View>
            <View>
              <Text style={styles.headerTitle}>APP SCHOLAR</Text>
              <Text style={styles.headerSubtitle}>
                Gestão Acadêmica • 14 Tabelas
              </Text>
            </View>
          </View>

          {abaAtiva !== 'dashboard' && (
            <TouchableOpacity
              style={styles.btnHome}
              onPress={() => {
                setAbaAtiva('dashboard');
                setBusca('');
              }}
            >
              <Ionicons name="grid-outline" size={16} color="#FFFFFF" />
              <Text style={styles.btnHomeText}>Início</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Barra de Navegação Horizontal entre todas as 14 tabelas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navScroll}
        >
          <TouchableOpacity
            style={[
              styles.navChip,
              abaAtiva === 'dashboard' && styles.navChipActive,
            ]}
            onPress={() => {
              setAbaAtiva('dashboard');
              setBusca('');
            }}
          >
            <Ionicons
              name="apps"
              size={14}
              color={abaAtiva === 'dashboard' ? '#1E3A8A' : '#DBEAFE'}
            />
            <Text
              style={[
                styles.navChipText,
                abaAtiva === 'dashboard' && styles.navChipTextActive,
              ]}
            >
              Painel Geral
            </Text>
          </TouchableOpacity>

          {TABELAS.map((tab) => {
            const ativo = abaAtiva === tab.id;
            const qtd = (dados[tab.id] || []).length;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.navChip, ativo && styles.navChipActive]}
                onPress={() => {
                  setAbaAtiva(tab.id);
                  setBusca('');
                }}
              >
                <Ionicons
                  name={tab.icone}
                  size={14}
                  color={ativo ? '#1E3A8A' : '#DBEAFE'}
                />
                <Text
                  style={[
                    styles.navChipText,
                    ativo && styles.navChipTextActive,
                  ]}
                >
                  {tab.nome} ({qtd})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Conteúdo Principal */}
      {abaAtiva === 'dashboard' ? (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Resumo Geral */}
          <View style={styles.summaryCard}>
            <View>
              <Text style={styles.summaryLabel}>BANCO DE DADOS CONECTADO</Text>
              <Text style={styles.summaryTitle}>
                14 Tabelas • {totalRegistros} Registros
              </Text>
              <Text style={styles.summaryDesc}>
                Selecione qualquer tabela abaixo para adicionar, editar ou excluir registros.
              </Text>
            </View>
            <View style={styles.summaryBadge}>
              <Ionicons name="server" size={26} color="#2563EB" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Todas as Tabelas do Sistema</Text>

          <View style={styles.grid}>
            {TABELAS.map((tab) => {
              const qtd = (dados[tab.id] || []).length;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.tableCard}
                  onPress={() => setAbaAtiva(tab.id)}
                >
                  <View style={styles.tableCardTop}>
                    <View
                      style={[
                        styles.tableIconBox,
                        { backgroundColor: `${tab.cor}18` },
                      ]}
                    >
                      <Ionicons name={tab.icone} size={20} color={tab.cor} />
                    </View>
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>
                        {qtd} {qtd === 1 ? 'linha' : 'linhas'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.tableCardTitle}>{tab.nome}</Text>
                  <Text style={styles.tableCardSub}>tabela: {tab.tabela}</Text>

                  <View style={styles.tableCardFooter}>
                    <Text style={[styles.gerenciarLink, { color: tab.cor }]}>
                      Gerenciar CRUD →
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        /* Tela da Tabela Selecionada com CRUD Completo */
        <View style={styles.tableContainer}>
          {/* Barra de Título e Botão ADICIONAR */}
          <View style={styles.tableHeaderBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeTableTitle}>{tabelaAtual.nome}</Text>
              <Text style={styles.activeTableSub}>
                Tabela `{tabelaAtual.tabela}` • {registrosFiltrados.length}{' '}
                registro(s)
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.btnAdd, { backgroundColor: tabelaAtual.cor }]}
              onPress={abrirAdicionar}
            >
              <Ionicons name="add-circle" size={18} color="#FFFFFF" />
              <Text style={styles.btnAddText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {/* Campo de Busca */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder={`Buscar em ${tabelaAtual.nome}...`}
              placeholderTextColor="#94A3B8"
              value={busca}
              onChangeText={setBusca}
            />
            {busca.length > 0 && (
              <TouchableOpacity onPress={() => setBusca('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Lista de Registros com botões EDITAR e EXCLUIR */}
          <ScrollView contentContainerStyle={styles.listScroll}>
            {registrosFiltrados.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons
                  name={tabelaAtual.icone}
                  size={40}
                  color="#CBD5E1"
                />
                <Text style={styles.emptyTitle}>
                  Nenhum registro encontrado
                </Text>
                <Text style={styles.emptyDesc}>
                  Toque em "Adicionar" para inserir o primeiro registro na tabela{' '}
                  {tabelaAtual.tabela}.
                </Text>
                <TouchableOpacity
                  style={[
                    styles.btnAddEmpty,
                    { backgroundColor: tabelaAtual.cor },
                  ]}
                  onPress={abrirAdicionar}
                >
                  <Ionicons name="add" size={18} color="#FFFFFF" />
                  <Text style={styles.btnAddText}>Novo Registro</Text>
                </TouchableOpacity>
              </View>
            ) : (
              registrosFiltrados.map((item, idx) => (
                <View key={item.id} style={styles.recordCard}>
                  <View style={styles.recordHeader}>
                    <View style={styles.recordIdBadge}>
                      <Text style={styles.recordIdText}>#{idx + 1}</Text>
                    </View>

                    {/* Botões de Ação: EDITAR e EXCLUIR */}
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.btnEdit}
                        onPress={() => abrirEditar(item)}
                      >
                        <Ionicons name="create-outline" size={15} color="#2563EB" />
                        <Text style={styles.btnEditText}>Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnDelete}
                        onPress={() => setItemExcluindo(item)}
                      >
                        <Ionicons name="trash-outline" size={15} color="#DC2626" />
                        <Text style={styles.btnDeleteText}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.fieldsList}>
                    {tabelaAtual.campos.map((campo) => (
                      <View key={campo.key} style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>{campo.label}:</Text>
                        <Text style={styles.fieldValue}>
                          {item[campo.key] ? String(item[campo.key]) : '—'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}

      {/* Modal de ADICIONAR / EDITAR */}
      <Modal
        visible={modalFormVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalFormVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {itemEditando
                  ? `Editar em ${tabelaAtual?.nome}`
                  : `Adicionar em ${tabelaAtual?.nome}`}
              </Text>
              <TouchableOpacity onPress={() => setModalFormVisivel(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {erroForm ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{erroForm}</Text>
              </View>
            ) : null}

            <ScrollView style={styles.modalBody}>
              {tabelaAtual?.campos.map((campo) => (
                <View key={campo.key} style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {campo.label} {campo.obrigatorio ? '*' : ''}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={campo.placeholder}
                    placeholderTextColor="#94A3B8"
                    value={formValores[campo.key] || ''}
                    onChangeText={(texto) =>
                      setFormValores((prev) => ({
                        ...prev,
                        [campo.key]: texto,
                      }))
                    }
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setModalFormVisivel(false)}
              >
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btnSave,
                  { backgroundColor: tabelaAtual?.cor || '#2563EB' },
                ]}
                onPress={salvarRegistro}
              >
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                <Text style={styles.btnSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de EXCLUSÃO */}
      <Modal
        visible={Boolean(itemExcluindo)}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setItemExcluindo(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <Ionicons name="trash" size={28} color="#DC2626" />
            </View>
            <Text style={styles.confirmTitle}>Excluir Registro?</Text>
            <Text style={styles.confirmDesc}>
              Tem certeza que deseja remover este item da tabela{' '}
              <Text style={{ fontWeight: '700' }}>{tabelaAtual?.tabela}</Text>?
              Esta ação não pode ser desfeita.
            </Text>

            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setItemExcluindo(null)}
              >
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnConfirmDelete}
                onPress={confirmarExclusao}
              >
                <Text style={styles.btnSaveText}>Sim, Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#1E3A8A',
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#BFDBFE',
    fontSize: 12,
  },
  btnHome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  btnHomeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  navScroll: {
    paddingHorizontal: 14,
    gap: 8,
  },
  navChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: 8,
  },
  navChipActive: {
    backgroundColor: '#FFFFFF',
  },
  navChipText: {
    color: '#EFF6FF',
    fontSize: 12,
    fontWeight: '600',
  },
  navChipTextActive: {
    color: '#1E3A8A',
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  summaryDesc: {
    fontSize: 12,
    color: '#64748B',
    maxWidth: 240,
  },
  summaryBadge: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tableCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  tableCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  tableCardSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  tableCardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  gerenciarLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  tableContainer: {
    flex: 1,
    padding: 16,
  },
  tableHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activeTableTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  activeTableSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  btnAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnAddEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
  },
  btnAddText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  listScroll: {
    paddingBottom: 24,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recordIdBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  recordIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnEditText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  btnDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnDeleteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  fieldsList: {
    gap: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  modalBody: {
    marginVertical: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  btnCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  btnCancelText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 13,
  },
  btnSave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  confirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
  },
  confirmIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  confirmDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnConfirmDelete: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
