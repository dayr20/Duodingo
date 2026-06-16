import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const TEMPLATES = [
  {
    label: 'Hello World',
    code: '// Ton premier programme JavaScript\nconsole.log("Hello, World!");\nconsole.log("Bienvenue sur Duodingo!");',
  },
  {
    label: 'Variables',
    code: 'const nom = "Alice";\nlet age = 25;\nconsole.log(`Je m\'appelle ${nom} et j\'ai ${age} ans.`);\n\n// Modification\nage = 26;\nconsole.log(`Maintenant j\'ai ${age} ans.`);',
  },
  {
    label: 'Boucle for',
    code: '// Compter de 1 à 5\nfor (let i = 1; i <= 5; i++) {\n  console.log(`Nombre: ${i}`);\n}\n\n// Somme des nombres\nlet somme = 0;\nfor (let i = 1; i <= 10; i++) {\n  somme += i;\n}\nconsole.log(`Somme de 1 à 10: ${somme}`);',
  },
  {
    label: 'Fonction',
    code: '// Déclarer une fonction\nfunction saluer(prenom) {\n  return `Bonjour, ${prenom}!`;\n}\n\nconsole.log(saluer("Bob"));\nconsole.log(saluer("Alice"));\n\n// Arrow function\nconst doubler = n => n * 2;\nconsole.log(doubler(7));',
  },
  {
    label: 'Tableau',
    code: 'const fruits = ["pomme", "banane", "cerise"];\n\n// Parcourir avec forEach\nfruits.forEach(f => console.log(f));\n\n// filter et map\nconst nums = [1, 2, 3, 4, 5];\nconst pairs = nums.filter(n => n % 2 === 0);\nconst doubles = nums.map(n => n * 2);\n\nconsole.log("Pairs:", pairs);\nconsole.log("Doubles:", doubles);',
  },
  {
    label: 'Conditions',
    code: 'const note = 15;\n\nif (note >= 18) {\n  console.log("Mention Très Bien");\n} else if (note >= 14) {\n  console.log("Mention Bien");\n} else if (note >= 12) {\n  console.log("Mention Assez Bien");\n} else {\n  console.log("Sans mention");\n}\n\n// Ternaire\nconst statut = note >= 10 ? "Reçu" : "Recalé";\nconsole.log(statut);',
  },
];

const runJavaScript = (code) => {
  const logs = [];
  const sandboxConsole = {
    log: (...args) => logs.push(args.map(a => {
      if (typeof a === 'object' && a !== null) return JSON.stringify(a);
      return String(a);
    }).join(' ')),
    error: (...args) => logs.push('❌ ' + args.map(a => String(a)).join(' ')),
    warn: (...args) => logs.push('⚠️ ' + args.map(a => String(a)).join(' ')),
  };

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function('console', code);
    fn(sandboxConsole);
    return { output: logs, error: null };
  } catch (e) {
    return { output: logs, error: e.message };
  }
};

const CodeSandboxScreen = ({ navigation }) => {
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const outputRef = useRef(null);

  const handleRun = () => {
    const { output: out, error: err } = runJavaScript(code);
    setOutput(out);
    setError(err);
    setHasRun(true);
  };

  const handleClear = () => {
    setOutput([]);
    setError(null);
    setHasRun(false);
  };

  const applyTemplate = (template) => {
    setCode(template.code);
    setShowTemplates(false);
    handleClear();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Sandbox JS</Text>
          <Text style={styles.headerSub}>Expérimente librement</Text>
        </View>
        <TouchableOpacity
          style={styles.templateBtn}
          onPress={() => setShowTemplates(!showTemplates)}
        >
          <Ionicons name="copy-outline" size={20} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      {/* Templates dropdown */}
      {showTemplates && (
        <View style={styles.templatesPanel}>
          <Text style={styles.templatesPanelTitle}>Exemples</Text>
          {TEMPLATES.map((t) => (
            <TouchableOpacity key={t.label} style={styles.templateItem} onPress={() => applyTemplate(t)}>
              <Ionicons name="code-slash-outline" size={16} color={COLORS.secondary} />
              <Text style={styles.templateItemText}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Editor */}
      <View style={styles.editorContainer}>
        <View style={styles.editorHeader}>
          <View style={styles.dot} /><View style={styles.dot} /><View style={styles.dot} />
          <Text style={styles.editorLang}>JavaScript</Text>
        </View>
        <ScrollView style={styles.editorScroll} keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.editor}
            value={code}
            onChangeText={setCode}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            keyboardType="default"
            placeholder="// Écris ton code ici..."
            placeholderTextColor={COLORS.textMuted}
            selectionColor={COLORS.primary}
          />
        </ScrollView>
      </View>

      {/* Run button */}
      <View style={styles.runBar}>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
          <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.runBtn} onPress={handleRun}>
          <Ionicons name="play" size={18} color={COLORS.white} />
          <Text style={styles.runBtnText}>EXÉCUTER</Text>
        </TouchableOpacity>
      </View>

      {/* Output */}
      {hasRun && (
        <View style={styles.outputContainer}>
          <View style={styles.outputHeader}>
            <Ionicons
              name={error ? 'close-circle' : 'checkmark-circle'}
              size={16}
              color={error ? COLORS.error : COLORS.primary}
            />
            <Text style={styles.outputLabel}>Console</Text>
          </View>
          <ScrollView style={styles.outputScroll} ref={outputRef}>
            {output.map((line, i) => (
              <Text key={i} style={styles.outputLine}>
                <Text style={styles.outputPrompt}>{'>'} </Text>{line}
              </Text>
            ))}
            {error && (
              <Text style={styles.outputError}>
                <Text style={styles.outputPrompt}>✗ </Text>{error}
              </Text>
            )}
            {output.length === 0 && !error && (
              <Text style={styles.outputEmpty}>Aucune sortie. Utilise console.log() pour afficher quelque chose.</Text>
            )}
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
    paddingBottom: 14,
    backgroundColor: COLORS.surface,
    gap: 12,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1 },
  headerTitle: { color: COLORS.white, fontSize: SIZES.lg, ...FONTS.bold },
  headerSub: { color: COLORS.textMuted, fontSize: SIZES.xs, ...FONTS.regular },
  templateBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },

  templatesPanel: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: SIZES.padding,
  },
  templatesPanelTitle: { color: COLORS.textMuted, fontSize: SIZES.xs, ...FONTS.bold, letterSpacing: 1, marginBottom: 8 },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  templateItemText: { color: COLORS.white, fontSize: SIZES.md, ...FONTS.medium },

  editorContainer: {
    flex: 1,
    backgroundColor: '#0D1B21',
    margin: 12,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#162028',
    gap: 6,
  },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.border },
  editorLang: { color: COLORS.textMuted, fontSize: SIZES.xs, ...FONTS.medium, marginLeft: 'auto' },
  editorScroll: { flex: 1 },
  editor: {
    color: '#A8D8EA',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
    lineHeight: 22,
    padding: 14,
    minHeight: 200,
    textAlignVertical: 'top',
  },

  runBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  clearBtn: {
    width: 40, height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  runBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: SIZES.radiusSmall,
  },
  runBtnText: { color: COLORS.white, fontSize: SIZES.md, ...FONTS.bold, letterSpacing: 1 },

  outputContainer: {
    height: 180,
    backgroundColor: '#0D1B21',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: SIZES.radiusSmall,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  outputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#162028',
  },
  outputLabel: { color: COLORS.textMuted, fontSize: SIZES.xs, ...FONTS.bold, letterSpacing: 1 },
  outputScroll: { flex: 1, padding: 10 },
  outputLine: {
    color: '#58CC02',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    lineHeight: 20,
  },
  outputPrompt: { color: COLORS.textMuted },
  outputError: {
    color: COLORS.error,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    lineHeight: 20,
  },
  outputEmpty: { color: COLORS.textMuted, fontSize: SIZES.sm, fontStyle: 'italic', padding: 4 },
});

export default CodeSandboxScreen;
