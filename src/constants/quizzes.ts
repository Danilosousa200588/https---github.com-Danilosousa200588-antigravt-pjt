import { Quiz } from '../types';

export const NURSING_QUIZZES: Quiz[] = [
  {
    id: 'nursing-easy-1',
    title: 'Fundamentos de Enfermagem',
    description: 'Princípios básicos e sinais vitais.',
    category: 'nursing',
    difficulty: 'easy',
    questions: [
      { id: 'q1-1', question: 'Qual é o local mais comum para verificar o pulso em um adulto?', options: ['Carotídeo', 'Braquial', 'Radial', 'Femoral'], correctAnswer: 2, explanation: 'O pulso radial é o mais comum e acessível.' },
      { id: 'q1-2', question: 'Qual é a frequência respiratória normal (eupneia) em um adulto em repouso?', options: ['12-20 mrm', '8-10 mrm', '25-30 mrm', '35-40 mrm'], correctAnswer: 0, explanation: 'A faixa normal para um adulto é de 12 a 20 incursões respiratórias por minuto.' },
      { id: 'q1-3', question: 'O que caracteriza a posição de Trendelenburg?', options: ['Sentado a 90 graus', 'Deitado de lado', 'Deitado de bruços', 'Deitado com a cabeça mais baixa que os pés'], correctAnswer: 3, explanation: 'Trendelenburg é a posição onde o corpo é inclinado de modo que a cabeça fique abaixo do nível dos pés.' },
      { id: 'q1-4', question: 'Qual é o termo técnico para a ausência de respiração?', options: ['Dispneia', 'Bradipneia', 'Apneia', 'Taquipneia'], correctAnswer: 2, explanation: 'Apneia é a interrupção temporária ou parada da respiração.' },
      { id: 'q1-5', question: 'Qual a finalidade da lavagem das mãos na prática de enfermagem?', options: ['Prevenir infecções cruzadas', 'Apenas estética', 'Economizar sabão', 'Cumprir horário'], correctAnswer: 0, explanation: 'A higienização das mãos é a medida mais importante para prevenir a transmissão de microrganismos.' },
      { id: 'q1-6', question: 'Se um paciente está com febre de 38°C, ele está necessariamente com uma infecção grave?', options: ['Sim, sempre', 'Febre não existe em enfermagem', 'Não, pode ser apenas uma reação fisiológica ou inflamação leve', '38°C é temperatura normal'], correctAnswer: 2, explanation: 'A febre é um sinal, não um diagnóstico. Pode ter diversas causas além de infecção grave.' },
      { id: 'q1-7', question: 'Qual é a primeira ação ao encontrar um paciente inconsciente?', options: ['Verificar a respiração', 'Chamar ajuda', 'Verificar a pulsação', 'Iniciar compressões'], correctAnswer: 1, explanation: 'A primeira ação é garantir a segurança e chamar por ajuda (protocolo de emergência).' },
      { id: 'q1-8', question: 'O uso de luvas substitui a necessidade de lavar as mãos?', options: ['Sim, as luvas protegem totalmente', 'Apenas se as luvas estiverem sujas', 'Depende do procedimento', 'Não, a lavagem deve ser feita antes e depois do uso'], correctAnswer: 3, explanation: 'As luvas podem ter microfuros e a contaminação pode ocorrer durante a retirada.' },
      { id: 'q1-9', question: 'Um paciente com pressão 140/90 mmHg é considerado hipertenso em uma única medida?', options: ['Não, é necessário confirmar em outras ocasiões', 'Sim, já é hipertensão', 'Sim, se ele estiver nervoso', 'Não, 140/90 é normal'], correctAnswer: 0, explanation: 'O diagnóstico de hipertensão requer medidas repetidas em momentos diferentes.' },
      { id: 'q1-10', question: 'A cor da urina pode ser alterada apenas pela ingestão de água?', options: ['Sim, apenas água', 'A cor nunca muda', 'Não, medicamentos e alimentos também alteram', 'Apenas por doenças'], correctAnswer: 2, explanation: 'Alimentos como beterraba e diversos medicamentos podem mudar drasticamente a cor da urina.' },
      { id: 'q1-11', question: 'O termômetro de mercúrio ainda é o padrão ouro recomendado pela OMS?', options: ['Sim, é o mais preciso', 'Sim, mas apenas em hospitais', 'Não, o digital é proibido', 'Não, seu uso foi banido em muitos países devido à toxicidade'], correctAnswer: 3, explanation: 'O mercúrio é tóxico e o uso desses termômetros está sendo descontinuado mundialmente.' },
      { id: 'q1-12', question: 'Se o paciente diz que não tem dor, mas está gemendo e inquieto, o que o enfermeiro deve considerar?', options: ['Avaliar sinais não-verbais de dor', 'Acreditar apenas no que o paciente diz', 'Ignorar os gemidos', 'Dar um calmante sem avaliar'], correctAnswer: 0, explanation: 'A dor é subjetiva, mas sinais não-verbais são indicadores importantes de desconforto.' },
      { id: 'q1-13', question: 'A limpeza do leito deve ser feita da área mais suja para a mais limpa?', options: ['Sim, para remover o grosso primeiro', 'Tanto faz a ordem', 'Não, sempre da área mais limpa para a mais suja', 'Depende do tipo de sujeira'], correctAnswer: 2, explanation: 'Para evitar a dispersão de microrganismos, limpa-se do menos contaminado para o mais contaminado.' },
      { id: 'q1-14', question: 'O estetoscópio deve ser higienizado apenas uma vez por dia?', options: ['Não precisa limpar', 'Apenas se cair no chão', 'Sim, é o suficiente', 'Não, deve ser limpo entre cada paciente'], correctAnswer: 3, explanation: 'O estetoscópio é um fômite e pode transmitir infecções entre pacientes.' }
    ]
  },
  {
    id: 'nursing-medium-1',
    title: 'Farmacologia Intermediária',
    description: 'Interações e efeitos colaterais comuns.',
    category: 'nursing',
    difficulty: 'medium',
    questions: [
      { id: 'q2-1', question: 'Qual o principal efeito colateral da administração rápida de Vancomicina?', options: ['Hipotensão severa', 'Parada cardíaca', 'Síndrome do Homem Vermelho', 'Urticária'], correctAnswer: 2, explanation: 'A infusão rápida de Vancomicina pode causar a Síndrome do Homem Vermelho devido à liberação de histamina.' },
      { id: 'q2-2', question: 'Qual é o antídoto específico para a superdosagem de Heparina?', options: ['Vitamina K', 'Naloxona', 'Flumazenil', 'Protaminas'], correctAnswer: 3, explanation: 'O sulfato de protamina é o agente neutralizante da heparina.' },
      { id: 'q2-3', question: 'A Digoxina pertence a qual classe de medicamentos?', options: ['Glicosídeos Cardíacos', 'Antibióticos', 'Anticoagulantes', 'Diuréticos'], correctAnswer: 0, explanation: 'A Digoxina é um cardiotônico usado no tratamento de insuficiência cardíaca e arritmias.' },
      { id: 'q2-4', question: 'Qual cuidado de enfermagem é essencial antes de administrar Digoxina?', options: ['Verificar peso', 'Verificar temperatura', 'Verificar glicemia', 'Verificar frequência cardíaca apical'], correctAnswer: 3, explanation: 'Deve-se verificar a frequência apical por 1 minuto; se < 60 bpm, a dose geralmente é retida.' },
      { id: 'q2-5', question: 'A via de administração "Sublingual" evita qual processo farmacocinético inicial?', options: ['Excreção renal', 'Distribuição tecidual', 'Ligação a proteínas', 'Efeito de primeira passagem hepática'], correctAnswer: 3, explanation: 'Medicamentos sublinguais são absorvidos diretamente na corrente sanguínea, pulando o fígado inicialmente.' },
      { id: 'q2-6', question: 'Todos os medicamentos genéricos são exatamente iguais aos de referência em todos os componentes?', options: ['Sim, 100% iguais', 'Genéricos não funcionam', 'Referência é sempre melhor', 'Não, apenas o princípio ativo e dose são iguais; excipientes podem mudar'], correctAnswer: 3, explanation: 'Genéricos têm o mesmo princípio ativo, mas podem ter corantes e conservantes differentes.' },
      { id: 'q2-7', question: 'A insulina NPH pode ser misturada com a insulina Regular na mesma seringa?', options: ['Sim, aspirando primeiro a Regular (clara) e depois a NPH (turva)', 'Nunca', 'Sim, aspirando primeiro a NPH', 'Apenas se o médico autorizar por escrito'], correctAnswer: 0, explanation: 'A regra é "clara antes da escura" para não contaminar o frasco de insulina rápida.' },
      { id: 'q2-8', question: 'O uso prolongado de corticoides pode ser interrompido abruptamente?', options: ['Sim, se o paciente estiver bem', 'Sim, para evitar efeitos colaterais', 'Depende da dose', 'Não, deve ser feito desmame para evitar insuficiência adrenal'], correctAnswer: 3, explanation: 'A interrupção brusca pode causar uma crise adrenal grave.' },
      { id: 'q2-9', question: 'Qual o principal risco da administração de Potássio (KCl) em bolus?', options: ['Hipertensão', 'Convulsão', 'Febre', 'Parada cardíaca em assistolia'], correctAnswer: 3, explanation: 'O potássio concentrado NUNCA deve ser feito em bolus, pois causa parada cardíaca imediata.' },
      { id: 'q2-10', question: 'A Varfarina (Marevan) tem sua ação monitorada por qual exame?', options: ['Hemograma', 'Creatinina', 'Glicemia', 'TAP/RNI'], correctAnswer: 3, explanation: 'O RNI é o padrão para monitorar a anticoagulação oral com Varfarina.' },
      { id: 'q2-11', question: 'Antibióticos curam infecções virais como a gripe?', options: ['Sim, são muito potentes', 'Apenas se a febre for alta', 'Sim, se forem injetáveis', 'Não, agem apenas contra bactérias'], correctAnswer: 3, explanation: 'Antibióticos não têm efeito sobre vírus.' },
      { id: 'q2-12', question: 'Um medicamento "vencido" há um dia perde 100% de sua eficácia imediatamente?', options: ['Sim, torna-se veneno', 'Sim, desaparece o efeito', 'Pode usar por mais um ano', 'Não, mas a estabilidade e potência não são mais garantidas'], correctAnswer: 3, explanation: 'A data de validade é o limite de segurança garantido pelo fabricante.' },
      { id: 'q2-13', question: 'A administração de ferro por via oral deve ser feita preferencialmente com:', options: ['Leite', 'Café', 'Chá', 'Suco de laranja (Vitamina C)'], correctAnswer: 3, explanation: 'A Vitamina C aumenta a absorção do ferro, enquanto o cálcio do leite a diminui.' },
      { id: 'q2-14', question: 'O termo "Efeito Colateral" é o mesmo que "Reação Alérgica"?', options: ['Sim, são sinônimos', 'Si, se for grave', 'Não, alergia é sempre leve', 'Não, efeito colateral é esperado; alergia é uma resposta imune'], correctAnswer: 3, explanation: 'Efeitos colaterais são ações secundárias conhecidas do fármaco.' }
    ]
  },
  {
    id: 'nursing-advanced-1',
    title: 'UTI e Cuidados Críticos',
    description: 'Monitorização e suporte avançado de vida.',
    category: 'nursing',
    difficulty: 'advanced',
    questions: [
      { id: 'q3-1', question: 'Na monitorização de PVC, onde deve ser posicionado o zero do manômetro?', options: ['Linha axilar média', '4º espaço intercostal', 'Processo xifoide', 'Eixo flebostático'], correctAnswer: 3, explanation: 'O eixo flebostático é o ponto de referência para a monitorização hemodinâmica.' },
      { id: 'q3-2', question: 'Qual o valor normal da Pressão Intracraniana (PIC) em adultos?', options: ['5-15 mmHg', '0-5 mmHg', '20-30 mmHg', '40-50 mmHg'], correctAnswer: 0, explanation: 'A PIC normal varia entre 5 e 15 mmHg em adultos em repouso.' },
      { id: 'q3-3', question: 'O que indica uma "curva de amortecimento" (damping) na monitorização de pressão arterial invasiva?', options: ['Pressão muito alta', 'Paciente acordado', 'Calibração perfeita', 'Problemas no sistema (bolhas, dobras)'], correctAnswer: 3, explanation: 'O amortecimento da curva geralmente indica ar no sistema, coágulos ou dobras no cateter.' },
      { id: 'q3-4', question: 'Qual o objetivo do uso de PEEP na ventilação mecânica?', options: ['Manter os alvéolos abertos no final da expiração', 'Aumentar a frequência', 'Diminuir o oxigênio', 'Aumentar a dor'], correctAnswer: 0, explanation: 'A PEEP (Pressão Positiva ao Final da Expiração) evita o colapso alveolar e melhora a oxigenação.' },
      { id: 'q3-5', question: 'Na Escala de Coma de Glasgow atualizada, qual a pontuação mínima?', options: ['0', '1', '5', '3'], correctAnswer: 3, explanation: 'A pontuação mínima na escala de Glasgow é 3 (ausência total de resposta).' },
      { id: 'q3-6', question: 'Um paciente em morte encefálica pode ter reflexos medulares (como o sinal de Lázaro)?', options: ['Não, morte é morte', 'Só se ele estiver vivo', 'É impossível', 'Sim, reflexos medulares não dependem do tronco cerebral'], correctAnswer: 3, explanation: 'Reflexos medulares podem ocorrer mesmo após a morte encefálica confirmada.' },
      { id: 'q3-7', question: 'Qual a principal complicação da aspiração traqueal em pacientes críticos?', options: ['Hipóxia e arritmias', 'Febre', 'Aumento da fome', 'Melhora da fala'], correctAnswer: 0, explanation: 'A aspiração remove oxigênio e estimula o nervo vago, podendo causar arritmias.' },
      { id: 'q3-8', question: 'O que significa um balanço hídrico muito positivo em um paciente com insuficiência cardíaca?', options: ['Melhora da hidratação', 'Necessidade de mais soro', 'Bom funcionamento renal', 'Risco de edema agudo de pulmão'], correctAnswer: 3, explanation: 'Excesso de líquido pode sobrecarregar o coração e pulmões.' },
      { id: 'q3-9', question: 'Na parada cardiorrespiratória, qual a profundidade ideal das compressões em adultos?', options: ['2-3 cm', '8-10 cm', 'Apenas encostar', '5-6 cm'], correctAnswer: 3, explanation: 'As diretrizes recomendam pelo menos 5 cm, mas não mais que 6 cm.' },
      { id: 'q3-10', question: 'O choque séptico é caracterizado principalmente por:', options: ['Hemorragia grave', 'Falha na bomba cardíaca', 'Obstrução mecânica', 'Vasodilatação sistêmica e má distribuição de fluxo'], correctAnswer: 3, explanation: 'A sepse causa uma resposta inflamatória que leva à queda da resistência vascular.' },
      { id: 'q3-11', question: 'A monitorização de oximetria de pulso é 100% confiável em pacientes com intoxicação por monóxido de carbono?', options: ['Sim, mede o oxigênio', 'Sim, se for digital', 'Apenas se o paciente estiver pálido', 'Não, o oxímetro confunde carboxihemoglobina com oxihemoglobina'], correctAnswer: 3, explanation: 'O oxímetro dará uma leitura falsamente alta de saturação.' },
      { id: 'q3-12', question: 'Um paciente com pH 7.25 e pCO2 55 mmHg apresenta:', options: ['Alcalose respiratória', 'Acidose metabólica', 'Normalidade', 'Acidose respiratória'], correctAnswer: 3, explanation: 'pH baixo e pCO2 alto indicam acidose de origem respiratória.' },
      { id: 'q3-13', question: 'Qual a função da noradrenalina no choque?', options: ['Vasoconstrição para aumentar a pressão arterial', 'Sedação', 'Diminuir a frequência cardíaca', 'Aumentar a diurese'], correctAnswer: 0, explanation: 'A noradrenalina é um potente vasopressor.' },
      { id: 'q3-14', question: 'O "delirium" na UTI é sempre causado por demência prévia?', options: ['Sim, sempre', 'Sim, se o paciente for idoso', 'Não existe delirium em UTI', 'Não, é uma disfunção cerebral aguda comum em pacientes críticos'], correctAnswer: 3, explanation: 'O delirium é multifatorial e reversível, diferente da demência.' }
    ]
  },
  {
    id: 'nursing-hard-1',
    title: 'Cálculo de Medicação Complexo',
    description: 'Dosagens críticas e gotejamento.',
    category: 'nursing',
    difficulty: 'hard',
    questions: [
      { id: 'q4-1', question: 'Prescrição: Dopamina 5mcg/kg/min em paciente de 70kg. Solução: 250mg em 250ml. Qual a vazão em ml/h?', options: ['10,5 ml/h', '42 ml/h', '5,25 ml/h', '21 ml/h'], correctAnswer: 3, explanation: 'Dose total: 350mcg/min. Concentração: 1mg/ml (1000mcg/ml). Vazão: 0,35ml/min * 60 = 21ml/h.' },
      { id: 'q4-2', question: 'Quantas microgotas por minuto são necessárias para administrar 100ml de soro em 30 minutos?', options: ['100 microgotas/min', '50 microgotas/min', '300 microgotas/min', '200 microgotas/min'], correctAnswer: 3, explanation: 'Fórmula: Volume / Tempo (em horas). 100 / 0,5h = 200 microgotas/min.' },
      { id: 'q4-3', question: 'Temos frasco de Penicilina de 5.000.000 UI. Diluímos em 8ml de AD. Qual o volume total final?', options: ['8 ml', '12 ml', '9 ml', '10 ml'], correctAnswer: 3, explanation: 'O pó da penicilina de 5 milhões ocupa 2ml. 8ml (diluente) + 2ml (pó) = 10ml total.' },
      { id: 'q4-4', question: 'Prescrição: 15mg de Gentamicina. Disponível ampola de 80mg/2ml. Quanto aspirar?', options: ['0,25 ml', '0,5 ml', '0,15 ml', '0,375 ml'], correctAnswer: 3, explanation: '80mg -- 2ml | 15mg -- x. x = (15 * 2) / 80 = 30 / 80 = 0,375 ml.' },
      { id: 'q4-5', question: 'Um soro de 1000ml deve correr a 28 gotas/min. Quanto tempo levará para acabar?', options: ['8 horas', '10 horas', '14 horas', '12 horas'], correctAnswer: 3, explanation: 'Tempo = Volume / (Gotas * 3). 1000 / (28 * 3) = 1000 / 84 ≈ 11,9h (12 horas).' },
      { id: 'q4-6', question: 'Se você dobrar o gotejamento de um soro, o tempo para acabar cai pela metade?', options: ['Sim, matemática pura', 'Não, depende do peso do paciente', 'Não muda nada', 'Sim, mas o risco de sobrecarga aumenta'], correctAnswer: 3, explanation: 'Matematicamente sim, mas clinicamente é uma pegadinha pois foca no risco ao paciente.' },
      { id: 'q4-7', question: 'Prescrição: 500ml de SG 5% para correr em 24h. Quantas gotas por minuto?', options: ['14 gotas/min', '21 gotas/min', '10 gotas/min', '7 gotas/min'], correctAnswer: 3, explanation: '500 / (24 * 3) = 500 / 72 ≈ 6,94 (7 gotas).' },
      { id: 'q4-8', question: 'Quantos gramas de glicose há em 500ml de SG 5%?', options: ['5g', '50g', '250g', '25g'], correctAnswer: 3, explanation: '5% significa 5g em 100ml. Logo, em 500ml há 25g.' },
      { id: 'q4-9', question: 'Para transformar 500ml de SG 5% em SG 10%, quantas ampolas de Glicose 50% (20ml) são necessárias?', options: ['1 ampola', '2 ampolas', '5 ampolas', '2,5 ampolas'], correctAnswer: 3, explanation: 'Precisa de mais 25g. Cada ampola de 50% em 20ml tem 10g. 25/10 = 2,5 ampolas.' },
      { id: 'q4-10', question: 'Uma ampola de 10ml de NaCl 20% contém quantos mEq de Sódio (aproximadamente)?', options: ['17 mEq', '51 mEq', '10 mEq', '34 mEq'], correctAnswer: 3, explanation: 'NaCl 20% tem 3,4 mEq/ml. 10ml = 34 mEq.' },
      { id: 'q4-11', question: 'Prescrição: 1.000.000 UI de Penicilina. Frasco de 5.000.000 UI diluído para 10ml. Quanto aspirar?', options: ['1 ml', '5 ml', '0,5 ml', '2 ml'], correctAnswer: 3, explanation: '5M -- 10ml | 1M -- x. x = 2ml.' },
      { id: 'q4-12', question: 'Se uma bomba de infusão está em 125 ml/h, quanto volume será infundido em 8 horas?', options: ['500 ml', '750 ml', '1250 ml', '1000 ml'], correctAnswer: 3, explanation: '125 * 8 = 1000 ml.' },
      { id: 'q4-13', question: 'A regra de três é a única forma de calcular medicações?', options: ['Sim, sempre', 'Sim, fórmulas não funcionam', 'Não, usa-se apenas o "olhômetro"', 'Não, existem fórmulas específicas para gotas e microgotas'], correctAnswer: 3, explanation: 'A regra de três é versátil, mas fórmulas simplificam o cálculo de tempo e gotejamento.' },
      { id: 'q4-14', question: 'O cálculo de dosagem para crianças é igual ao de adultos?', options: ['Sim, só muda o tamanho da agulha', 'Sim, se a criança for grande', 'Não, crianças não tomam remédio', 'Não, geralmente é baseado no peso (mg/kg) ou área de superfície corporal'], correctAnswer: 3, explanation: 'A farmacocinética pediátrica exige cálculos precisos por peso.' }
    ]
  },
  {
    id: 'nursing-professional-1',
    title: 'Gestão e Auditoria em Saúde',
    description: 'Liderança e processos de qualidade hospitalar.',
    category: 'nursing',
    difficulty: 'professional',
    questions: [
      { id: 'q5-1', question: 'Qual indicador avalia a incidência de eventos adversos evitáveis?', options: ['Taxa de mortalidade', 'Giro de leito', 'Tempo médio de permanência', 'Segurança do Paciente'], correctAnswer: 3, explanation: 'Os indicadores de segurança do paciente monitoram eventos adversos como quedas e erros de medicação.' },
      { id: 'q5-2', question: 'O que define o método de acreditação hospitalar ONA?', options: ['Punição de erros', 'Melhoria contínua e segurança', 'Apenas redução de custos', 'Marketing apenas'], correctAnswer: 1, explanation: 'A ONA foca na qualidade dos serviços de saúde através da melhoria contínua e segurança do paciente.' },
      { id: 'q5-3', question: 'Qual a principal função da Auditoria de Enfermagem?', options: ['Vigiar funcionários', 'Organizar escalas', 'Limpar o setor', 'Conferir prontuários para garantir qualidade e faturamento'], correctAnswer: 3, explanation: 'A auditoria analisa registros para verificar a conformidade da assistência e a exatidão das contas hospitalares.' },
      { id: 'q5-4', question: 'O Ciclo PDCA é uma ferramenta de gestão que significa:', options: ['Planejar, Fazer, Checar, Agir', 'Parar, Dormir, Comer, Acordar', 'Pedir, Dar, Comprar, Alugar', 'Poder, Dever, Crer, Amar'], correctAnswer: 0, explanation: 'PDCA: Plan (Planejar), Do (Fazer), Check (Checar), Act (Agir).' },
      { id: 'q5-5', question: 'Na gestão de conflitos, a estratégia de "Colaboração" visa:', options: ['Um lado ganha, outro perde', 'Ambos perdem', 'Evitar o problema', 'Ganhar-Ganhar'], correctAnswer: 3, explanation: 'A colaboração busca uma solução que satisfaça as necessidades de todas as partes envolvidas.' },
      { id: 'q5-6', question: 'Um líder autoritário é sempre pior que um líder liberal?', options: ['Sim, autoritarismo é ruim', 'Líder liberal é sempre melhor', 'Liderança não importa', 'Não, depende da situação e da maturidade da equipe'], correctAnswer: 3, explanation: 'Em situações de emergência, a liderança autocrática pode ser necessária para salvar vidas.' },
      { id: 'q5-7', question: 'O que é o dimensionamento de pessoal de enfermagem?', options: ['Medir a altura dos enfermeiros', 'Cálculo do número necessário de profissionais para a assistência', 'Organizar as férias', 'Comprar uniformes'], correctAnswer: 1, explanation: 'É o processo sistemático para determinar o quantitativo de profissionais por categoria.' },
      { id: 'q5-8', question: 'A sistematização da assistência de enfermagem (SAE) é opcional?', options: ['Sim, faz quem quer', 'Sim, apenas em hospitais privados', 'Não, mas ninguém faz', 'Não, é uma exigência legal do COFEN'], correctAnswer: 3, explanation: 'A SAE é privativa do enfermeiro e obrigatória em todas as instituições de saúde.' },
      { id: 'q5-9', question: 'Qual a diferença entre eficácia e eficiência na gestão?', options: ['São iguais', 'Eficiência é ser rápido; eficácia é ser bom', 'Não há diferença', 'Eficácia é atingir o resultado; eficiência é usar bem os recursos'], correctAnswer: 3, explanation: 'Eficácia foca no "o quê" (objetivo); eficiência foca no "como" (processo).' },
      { id: 'q5-10', question: 'O prontuário do paciente pertence ao hospital?', options: ['Sim, eles que pagam o papel', 'Sim, o paciente não pode ver', 'Pertence ao médico', 'Não, pertence ao paciente; o hospital é apenas o guardião'], correctAnswer: 3, explanation: 'O prontuário é propriedade do paciente, que tem direito de acesso e cópia.' },
      { id: 'q5-11', question: 'Na auditoria, o que significa "glosa"?', options: ['Um elogio', 'Um tipo de curativo', 'Aumento de salário', 'Recusa de pagamento de um item por falta de registro ou erro'], correctAnswer: 3, explanation: 'Glosas ocorrem quando o auditor do convênio não aceita a cobrança de um procedimento.' },
      { id: 'q5-12', question: 'A ética profissional permite que o enfermeiro publique fotos de pacientes em redes sociais?', options: ['Sim, se o paciente for bonito', 'Sim, se tiver muitos seguidores', 'Apenas se o hospital deixar', 'Não, fere o sigilo e a dignidade do paciente'], correctAnswer: 3, explanation: 'A exposição de pacientes sem finalidade científica e autorização é infração ética.' },
      { id: 'q5-13', question: 'O enfermeiro pode delegar a prescrição de enfermagem ao técnico?', options: ['Sim, para ajudar no serviço', 'Sim, se o técnico for experiente', 'Apenas em feriados', 'Não, é atividade privativa do enfermeiro'], correctAnswer: 3, explanation: 'O diagnóstico e a prescrição de enfermagem não podem ser delegados.' },
      { id: 'q5-14', question: 'A gestão participativa exclui a figura do líder?', options: ['Sim, todos mandam igual', 'Sim, é uma anarquia', 'Não, o líder continua mandando sozinho', 'Não, o líder atua como facilitador e integrador das decisões'], correctAnswer: 3, explanation: 'Na gestão participativa, as decisões são compartilhadas, mas a liderança é essencial.' }
    ]
  }
];

export const BIBLE_QUIZZES: Quiz[] = [
  {
    id: 'bible-easy-1',
    title: 'Histórias da Infância',
    description: 'Personagens e milagres conhecidos.',
    category: 'bible',
    difficulty: 'easy',
    questions: [
      { id: 'bq1-1', question: 'Quem derrotou o gigante Golias?', options: ['Saul', 'Davi', 'Salomão', 'Sansão'], correctAnswer: 1, explanation: 'Davi, o jovem pastor, derrotou o gigante com uma funda e uma pedra.' },
      { id: 'bq1-2', question: 'Quantos dias e noites choveu durante o Dilúvio?', options: ['40 dias', '7 dias', '100 dias', '12 dias'], correctAnswer: 0, explanation: 'A Bíblia afirma que choveu sobre a terra quarenta dias e quarenta noites.' },
      { id: 'bq1-3', question: 'Quem foi engolido por um grande peixe após fugir de Deus?', options: ['Pedro', 'Noé', 'Daniel', 'Jonas'], correctAnswer: 3, explanation: 'Jonas tentou fugir para Társis e acabou sendo engolido por um grande peixe.' },
      { id: 'bq1-4', question: 'Qual era o nome da esposa de Abraão?', options: ['Sara', 'Rebeca', 'Raquel', 'Lia'], correctAnswer: 0, explanation: 'Sara foi a esposa de Abraão e mãe de Isaque na velhice.' },
      { id: 'bq1-5', question: 'Quem foi colocado em uma cova de leões por orar a Deus?', options: ['José', 'Elias', 'Jeremias', 'Daniel'], correctAnswer: 3, explanation: 'Daniel foi lançado na cova devido à sua fidelidade em orar a Deus.' },
      { id: 'bq1-6', question: 'Quantos animais de cada espécie Moisés levou na arca?', options: ['Dois de cada', 'Sete de alguns', 'Quatro de cada', 'Nenhum, quem levou foi Noé'], correctAnswer: 3, explanation: 'Moisés não construiu a arca, foi Noé!' },
      { id: 'bq1-7', question: 'Qual era a profissão de Jesus antes de iniciar seu ministério?', options: ['Carpinteiro', 'Pescador', 'Pastor', 'Agricultor'], correctAnswer: 0, explanation: 'Jesus era conhecido como o filho do carpinteiro e ele mesmo exercia o ofício.' },
      { id: 'bq1-8', question: 'Quem traiu Jesus por 30 moedas de prata?', options: ['Pedro', 'João', 'Tomé', 'Judas Iscariotes'], correctAnswer: 3, explanation: 'Judas Iscariotes entregou Jesus aos principais dos sacerdotes.' },
      { id: 'bq1-9', question: 'Quantos mandamentos Deus deu a Moisés no Monte Sinai?', options: ['10', '5', '7', '12'], correctAnswer: 0, explanation: 'Deus entregou as Tábuas da Lei com os Dez Mandamentos.' },
      { id: 'bq1-10', question: 'Quem foi o homem mais forte da Bíblia?', options: ['Golias', 'Davi', 'Saul', 'Sansão'], correctAnswer: 3, explanation: 'Sansão recebeu força sobrenatural de Deus para libertar Israel.' },
      { id: 'bq1-11', question: 'Qual o nome do primeiro homem criado por Deus?', options: ['Adão', 'Abraão', 'Noé', 'Caim'], correctAnswer: 0, explanation: 'Adão foi the primeiro homem, criado do pó da terra.' },
      { id: 'bq1-12', question: 'Quantas pessoas entraram na arca de Noé?', options: ['8', '2', '4', '12'], correctAnswer: 0, explanation: 'Entraram Noé, sua esposa, seus três filhos e as esposas deles.' },
      { id: 'bq1-13', question: 'Quem abriu o Mar Vermelho com um cajado?', options: ['Josué', 'Arão', 'Elias', 'Moisés'], correctAnswer: 3, explanation: 'Moisés, sob o comando de Deus, estendeu o cajado e o mar se abriu.' },
      { id: 'bq1-14', question: 'Jesus nasceu em qual cidade?', options: ['Belém', 'Nazaré', 'Jerusalém', 'Jericó'], correctAnswer: 0, explanation: 'Jesus nasceu em Belém da Judeia, cumprindo a profecia.' }
    ]
  },
  {
    id: 'bible-medium-1',
    title: 'Parábolas de Jesus',
    description: 'Ensinamentos e significados.',
    category: 'bible',
    difficulty: 'medium',
    questions: [
      { id: 'bq2-1', question: 'Na parábola do Semeador, o que representa a semente?', options: ['O dinheiro', 'As pessoas', 'A fé', 'A palavra de Deus'], correctAnswer: 3, explanation: 'Jesus explicou que a semente é a palavra de Deus (Lucas 8:11).' },
      { id: 'bq2-2', question: 'Na parábola do Filho Pródigo, o que o pai faz quando o filho volta?', options: ['O expulsa', 'Corre ao seu encontro e o abraça', 'O ignora', 'O faz trabalhar como escravo'], correctAnswer: 1, explanation: 'O pai o recebe com misericórdia, alegria e uma grande festa.' },
      { id: 'bq2-3', question: 'Quem ajudou o homem ferido na estrada para Jericó?', options: ['Um Sacerdote', 'Um Levita', 'Um Soldado', 'Um Samaritano'], correctAnswer: 3, explanation: 'O Bom Samaritano foi o único que parou para cuidar do ferido.' },
      { id: 'bq2-4', question: 'Na parábola das Dez Virgens, por que cinco delas foram chamadas de "loucas"?', options: ['Não tinham lâmpadas', 'Não levaram azeite reserva', 'Dormiram demais', 'Perderam a chave'], correctAnswer: 1, explanation: 'As virgens loucas não se prepararam para the demora do noivo e ficaram sem azeite.' },
      { id: 'bq2-5', question: 'Qual o significado da parábola da Ovelha Perdida?', options: ['Deus cuida apenas dos bons', 'Ovelhas são animais teimosos', 'Pastores devem ser fortes', 'A alegria no céu por um pecador que se arrepende'], correctAnswer: 3, explanation: 'Jesus mostra o amor de Deus que busca ativamente aquele que se desviou.' },
      { id: 'bq2-6', question: 'Na parábola do Bom Samaritano, quem passou primeiro pelo homem ferido?', options: ['O Samaritano', 'O Sacerdote', 'O Levita', 'O Soldado'], correctAnswer: 1, explanation: 'O Sacerdote passou primeiro, depois o Levita, e por fim o Samaritano.' },
      { id: 'bq2-7', question: 'Quantos talentos o servo que recebeu apenas um talento enterrou?', options: ['Nenhum', 'Dois', 'Cinco', 'Um'], correctAnswer: 3, explanation: 'O servo mau e negligente enterrou o único talento que recebeu.' },
      { id: 'bq2-8', question: 'Na parábola do Grão de Mostarda, o que acontece com a pequena semente?', options: ['Ela morre', 'Ela é comida pelos pássaros', 'Ela fica do mesmo tamanho', 'Ela cresce e se torna uma grande árvore'], correctAnswer: 3, explanation: 'Jesus comparou o Reino de Deus a um grão de mostarda que cresce muito.' },
      { id: 'bq2-9', question: 'Quem Jesus disse que era o "próximo" na parábola do Bom Samaritano?', options: ['Aquele que mora ao lado', 'Apenas os judeus', 'Apenas os amigos', 'Aquele que usou de misericórdia'], correctAnswer: 3, explanation: 'O próximo é aquele que demonstra amor e cuidado, independente de raça ou religião.' },
      { id: 'bq2-10', question: 'Na parábola do Credor Incompassivo, quanto o primeiro servo devia ao rei?', options: ['Cem denários', 'Mil pratas', 'Nada', 'Dez mil talentos'], correctAnswer: 3, explanation: 'Ele devia uma fortuna impagável, mas foi perdoado pelo rei.' },
      { id: 'bq2-11', question: 'O que o semeador representa na parábola do semeador?', options: ['O diabo', 'O mundo', 'O pecado', 'Aquele que prega a palavra'], correctAnswer: 3, explanation: 'O semeador é aquele que espalha a mensagem do Reino.' },
      { id: 'bq2-12', question: 'Na parábola da Dracma Perdida, o que a mulher faz ao encontrar a moeda?', options: ['Guarda em segredo', 'Gasta tudo', 'Fica triste', 'Chama as amigas e vizinhas para celebrar'], correctAnswer: 3, explanation: 'Ela celebra com grande alegria por ter achado o que estava perdido.' },
      { id: 'bq2-13', question: 'Na parábola do Trigo e do Joio, quem planta o joio?', options: ['O dono do campo', 'Os servos', 'A chuva', 'O inimigo (o diabo)'], correctAnswer: 3, explanation: 'O inimigo semeia o joio no meio do trigo durante a noite.' },
      { id: 'bq2-14', question: 'Qual o destino final do joio na parábola?', options: ['Ser guardado no celeiro', 'Ser replantado', 'Ser vendido', 'Ser queimado no fogo'], correctAnswer: 3, explanation: 'O joio é separado no final e lançado ao fogo.' }
    ]
  },
  {
    id: 'bible-advanced-1',
    title: 'As Viagens de Paulo',
    description: 'Geografia e história do Novo Testamento.',
    category: 'bible',
    difficulty: 'advanced',
    questions: [
      { id: 'bq3-1', question: 'Em qual cidade Paulo foi preso e enviado para Roma?', options: ['Éfeso', 'Jerusalém', 'Corinto', 'Antioquia'], correctAnswer: 1, explanation: 'Paulo foi preso in Jerusalém e apelou para César, sendo enviado a Roma.' },
      { id: 'bq3-2', question: 'Quem acompanhou Paulo em sua primeira viagem missionária?', options: ['Barnabé', 'Silas', 'Timóteo', 'Lucas'], correctAnswer: 0, explanation: 'Barnabé foi o companheiro principal de Paulo na primeira jornada.' },
      { id: 'bq3-3', question: 'Em qual cidade Paulo pregou no Areópago?', options: ['Roma', 'Tessalônica', 'Atenas', 'Filipos'], correctAnswer: 2, explanation: 'Em Atenas, Paulo debateu com filósofos epicureus e estoicos no Areópago.' },
      { id: 'bq3-4', question: 'Qual era a profissão de Paulo, que ele exercia para se sustentar?', options: ['Pescador', 'Carpinteiro', 'Cobrador de impostos', 'Fabricante de tendas'], correctAnswer: 3, explanation: 'Paulo era fabricante de tendas (ou coureiro), ofício que compartilhava com Áquila e Priscila.' },
      { id: 'bq3-5', question: 'Em qual ilha Paulo sofreu um naufrágio a caminho de Roma?', options: ['Creta', 'Malta', 'Chipre', 'Patmos'], correctAnswer: 1, explanation: 'O navio naufragou na costa da ilha de Malta, onde todos se salvaram.' },
      { id: 'bq3-6', question: 'Paulo era um dos 12 apóstolos originais que andaram com Jesus?', options: ['Sim, ele era muito importante', 'Sim, ele substituiu Judas', 'Não, ele era apenas um profeta', 'Não, ele se tornou apóstolo após a ressurreição de Cristo'], correctAnswer: 3, explanation: 'Paulo não estava entre os 12 originais; Matias foi quem substituiu Judas.' },
      { id: 'bq3-7', question: 'Qual era o nome de Paulo antes de sua conversão?', options: ['Simão', 'Levi', 'Estêvão', 'Saulo'], correctAnswer: 3, explanation: 'Ele era conhecido como Saulo de Tarso, o perseguidor da igreja.' },
      { id: 'bq3-8', question: 'Para qual cidade Paulo estava indo quando teve sua visão de Jesus?', options: ['Jerusalém', 'Roma', 'Tarso', 'Damasco'], correctAnswer: 3, explanation: 'No caminho de Damasco, uma grande luz o cercou e ele ouviu a voz de Jesus.' },
      { id: 'bq3-9', question: 'Quem batizou Paulo em Damasco?', options: ['Pedro', 'Ananias', 'João', 'Filipe'], correctAnswer: 1, explanation: 'Ananias foi enviado por Deus para orar por Paulo e batizá-lo.' },
      { id: 'bq3-10', question: 'Quantas viagens missionárias de Paulo são registradas no livro de Atos?', options: ['Uma', 'Três', 'Duas', 'Quatro'], correctAnswer: 1, explanation: 'Atos registra três grandes viagens missionárias, além de sua viagem final a Roma.' },
      { id: 'bq3-11', question: 'Em qual cidade Paulo e Silas cantaram na prisão à meia-noite?', options: ['Filipos', 'Tessalônica', 'Éfeso', 'Listra'], correctAnswer: 0, explanation: 'Eles estavam presos em Filipos quando um terremoto abriu as portas da prisão.' },
      { id: 'bq3-12', question: 'Quem era o jovem discípulo que Paulo considerava como um "filho na fé"?', options: ['Tito', 'Marcos', 'Lucas', 'Timóteo'], correctAnswer: 3, explanation: 'Timóteo foi um dos colaboradores mais próximos e amados de Paulo.' },
      { id: 'bq3-13', question: 'Paulo escreveu a maioria de suas cartas enquanto estava em qual situação?', options: ['Em férias', 'No templo', 'Em navios', 'Na prisão'], correctAnswer: 3, explanation: 'Muitas das epístolas paulinas são conhecidas como "Cartas da Prisão".' },
      { id: 'bq3-14', question: 'Qual era a cidadania de Paulo que o protegia de ser açoitado sem julgamento?', options: ['Grega', 'Judaica', 'Egípcia', 'Romana'], correctAnswer: 3, explanation: 'Sua cidadania romana lhe garantia direitos legais específicos no Império.' }
    ]
  },
  {
    id: 'bible-hard-1',
    title: 'Profecias Messiânicas',
    description: 'Antigo Testamento e o cumprimento em Cristo.',
    category: 'bible',
    difficulty: 'hard',
    questions: [
      { id: 'bq4-1', question: 'Qual profeta descreveu o "Servo Sofredor" no capítulo 53?', options: ['Jeremias', 'Isaías', 'Ezequiel', 'Daniel'], correctAnswer: 1, explanation: 'Isaías 53 é uma das profecias mais claras sobre o sacrifício de Jesus.' },
      { id: 'bq4-2', question: 'Qual profeta previu que o Messias nasceria em Belém?', options: ['Miqueias', 'Oseias', 'Malaquias', 'Zacarias'], correctAnswer: 0, explanation: 'Miqueias 5:2 profetiza Belém Efrata como o lugar de origem do governante de Israel.' },
      { id: 'bq4-3', question: 'Onde no Antigo Testamento está a profecia de que o Messias seria traído por 30 moedas de prata?', options: ['Salmos', 'Amós', 'Habacuque', 'Zacarias'], correctAnswer: 3, explanation: 'Zacarias 11:12-13 menciona as trinta moedas de prata lançadas ao oleiro.' },
      { id: 'bq4-4', question: 'Qual salmo descreve detalhes da crucificação, como o sorteio das vestes?', options: ['Salmo 22', 'Salmo 1', 'Salmo 23', 'Salmo 91'], correctAnswer: 0, explanation: 'O Salmo 22 descreve sofrimentos que Jesus citou e viveu na cruz.' },
      { id: 'bq4-5', question: 'A profecia de que o Messias entraria em Jerusalém montado em um jumentinho está em:', options: ['Isaías', 'Jeremias', 'Ezequiel', 'Zacarias'], correctAnswer: 3, explanation: 'Zacarias 9:9 diz: "Eis que o teu rei virá a ti... humilde, e montado sobre um jumento".' },
      { id: 'bq4-6', question: 'O Antigo Testamento termina com a palavra "Amém"?', options: ['Sim, como todas as orações', 'Sim, em Malaquias', 'Não, termina com "Glória"', 'Não, termina com a palavra "Maldição" (em algumas traduções)'], correctAnswer: 3, explanation: 'Curiosamente, o livro de Malaquias termina com um aviso solene (Maldição/Anátema).' },
      { id: 'bq4-7', question: 'Qual profeta falou sobre as "Setenta Semanas" relacionadas ao Messias?', options: ['Ezequiel', 'Jeremias', 'Oséias', 'Daniel'], correctAnswer: 3, explanation: 'Daniel 9 contém a profecia das setenta semanas sobre a vinda do Ungido.' },
      { id: 'bq4-8', question: 'Onde está escrito que o Messias seria chamado "Emanuel"?', options: ['Salmo 110', 'Gênesis 3:15', 'Malaquias 4', 'Isaías 7:14'], correctAnswer: 3, explanation: 'Isaías profetizou que a virgem daria à luz um filho e chamaria seu nome Emanuel.' },
      { id: 'bq4-9', question: 'Qual profeta previu a fuga da família de Jesus para o Egito?', options: ['Jeremias', 'Amós', 'Miqueias', 'Oséias'], correctAnswer: 3, explanation: 'Oséias 11:1 diz: "Do Egito chamei o meu filho", citado em Mateus.' },
      { id: 'bq4-10', question: 'A profecia de que o Messias seria uma "Luz para os Gentios" está em:', options: ['Salmos', 'Provérbios', 'Eclesiastes', 'Isaías'], correctAnswer: 3, explanation: 'Isaías frequentemente descreve o Messias como luz para as nações.' },
      { id: 'bq4-11', question: 'Qual salmo profetiza que o Messias não veria a corrupção (ressurreição)?', options: ['Salmo 16', 'Salmo 23', 'Salmo 51', 'Salmo 119'], correctAnswer: 0, explanation: 'O Salmo 16:10 diz: "Nem permitirás que o teu Santo veja corrupção".' },
      { id: 'bq4-12', question: 'Quem profetizou que o Messias seria um sacerdote segundo a ordem de Melquisedeque?', options: ['Moisés', 'Samuel', 'Elias', 'Davi (Salmos)'], correctAnswer: 3, explanation: 'O Salmo 110:4 afirma essa ordem sacerdotal eterna.' },
      { id: 'bq4-13', question: 'A profecia da "Nova Aliança" escrita nos corações é de qual profeta?', options: ['Isaías', 'Ezequiel', 'Daniel', 'Jeremias'], correctAnswer: 3, explanation: 'Jeremias 31:31-34 descreve a Nova Aliança que Deus faria com Seu povo.' },
      { id: 'bq4-14', question: 'Qual profeta previu que o Messias seria "traspassado" pelas nossas transgressões?', options: ['Isaías', 'Zacarias', 'Nenhum', 'Ambos'], correctAnswer: 3, explanation: 'Tanto Isaías 53 quanto Zacarias 12:10 mencionam o Messias sendo traspassado.' }
    ]
  },
  {
    id: 'bible-professional-1',
    title: 'Teologia e Hermenêutica',
    description: 'Estudo profundo das escrituras.',
    category: 'bible',
    difficulty: 'professional',
    questions: [
      { id: 'bq5-1', question: 'O que significa o termo grego "Kenosis" em Filipenses 2?', options: ['Exaltação', 'Sabedoria', 'Justificação', 'Esvaziamento'], correctAnswer: 3, explanation: 'Kenosis refere-se ao auto-esvaziamento de Cristo ao assumir a forma humana.' },
      { id: 'bq5-2', question: 'Qual o significado do termo "Hermenêutica"?', options: ['Estudo da história', 'Tradução de línguas', 'Escrita de hinos', 'Ciência da interpretação de textos'], correctAnswer: 3, explanation: 'Hermenêutica é a teoria e metodologia da interpretação, especialmente da Bíblia.' },
      { id: 'bq5-3', question: 'O conceito de "Justificação pela Fé" é central em qual epístola de Paulo?', options: ['Efésios', 'Colossenses', 'Filipenses', 'Romanos'], correctAnswer: 3, explanation: 'Romanos é o tratado teológico mais denso de Paulo sobre a graça e a fé.' },
      { id: 'bq5-4', question: 'O termo "Paracleto" (Parakletos) usado por João para o Espírito Santo significa:', options: ['Criador', 'Juiz', 'Rei', 'Consolador/Ajudador'], correctAnswer: 3, explanation: 'Parakletos significa "aquele que é chamado para o lado", um advogado ou consolador.' },
      { id: 'bq5-5', question: 'Na teologia bíblica, a "Escatologia" estuda:', options: ['A origem do mundo', 'A vida dos santos', 'A lei de Moisés', 'As últimas coisas / fim dos tempos'], correctAnswer: 3, explanation: 'Escatologia é o estudo dos eventos finais da história e do destino da humanidade.' },
      { id: 'bq5-6', question: 'A Bíblia diz que o fruto proibido no Éden era uma maçã?', options: ['Sim, todo mundo sabe disso', 'Sim, está em Gênesis 3', 'Não, era um figo', 'Não, a Bíblia diz apenas "fruto do conhecimento do bem e do mal"'], correctAnswer: 3, explanation: 'A Bíblia nunca especifica o tipo de fruto; a maçã é uma tradição posterior.' },
      { id: 'bq5-7', question: 'O que significa o termo "Exegese"?', options: ['Sair de um lugar', 'Inserir ideias próprias no texto', 'Cantar um salmo', 'Extrair o significado original do texto'], correctAnswer: 3, explanation: 'Exegese é a análise crítica e sistemática para descobrir o sentido original de um texto.' },
      { id: 'bq5-8', question: 'Qual o significado de "Soteriologia"?', options: ['Estudo dos anjos', 'Estudo da igreja', 'Estudo do pecado', 'Estudo da salvação'], correctAnswer: 3, explanation: 'Soteriologia é o ramo da teologia que estuda a doutrina da salvação.' },
      { id: 'bq5-9', question: 'O termo "Teofania" refere-se a:', options: ['Uma música sagrada', 'Um tipo de batismo', 'O fim do mundo', 'Uma manifestação visível de Deus'], correctAnswer: 3, explanation: 'Teofania é uma manifestação de Deus aos seres humanos de forma perceptível.' },
      { id: 'bq5-10', question: 'O que é a "Septuaginta" (LXX)?', options: ['O Novo Testamento em latim', 'Os 70 livros da Bíblia', 'Uma seita antiga', 'A tradução grega do Antigo Testamento'], correctAnswer: 3, explanation: 'A Septuaginta foi a tradução do AT hebraico para o grego koiné.' },
      { id: 'bq5-11', question: 'Qual o significado de "Cristologia"?', options: ['Estudo da criação', 'Estudo da cruz', 'Estudo dos cristãos', 'Estudo da pessoa e obra de Cristo'], correctAnswer: 3, explanation: 'Cristologia foca na natureza divina e humana de Jesus e sua missão.' },
      { id: 'bq5-12', question: 'O termo "Pneumatologia" estuda:', options: ['As doenças pulmonares', 'A alma humana', 'Os anjos', 'O Espírito Santo'], correctAnswer: 3, explanation: 'Pneumatologia é o estudo teológico sobre o Espírito Santo.' },
      { id: 'bq5-13', question: 'O que significa "Apologética" cristã?', options: ['Pedir desculpas por ser cristão', 'O estudo dos apóstolos', 'A escrita de poesias', 'A defesa racional da fé cristã'], correctAnswer: 3, explanation: 'Apologética é a disciplina que visa defender a veracidade do cristianismo.' },
      { id: 'bq5-14', question: 'O conceito de "Sola Scriptura" afirma que:', options: ['A tradição é superior à Bíblia', 'Apenas os pastores podem ler a Bíblia', 'A Bíblia deve ser lida apenas em latim', 'A Bíblia é a única autoridade suprema de fé e prática'], correctAnswer: 3, explanation: 'Sola Scriptura foi um dos pilares della Reforma, enfatizando a suficiência das Escrituras.' }
    ]
  }
];
