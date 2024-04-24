import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';
// import cpp from 'highlight.js/lib/languages/cpp';
// import xml from 'highlight.js/lib/languages/xml';
// import bash from 'highlight.js/lib/languages/bash';
// import coffeescript from 'highlight.js/lib/languages/coffeescript';
// import css from 'highlight.js/lib/languages/css';
// import markdown from 'highlight.js/lib/languages/markdown';
// import http from 'highlight.js/lib/languages/http';
// import java from 'highlight.js/lib/languages/java';
// import javascript from 'highlight.js/lib/languages/javascript';
// import json from 'highlight.js/lib/languages/json';
// import less from 'highlight.js/lib/languages/less';
// import makefile from 'highlight.js/lib/languages/makefile';
// import nginx from 'highlight.js/lib/languages/nginx';
// import php from 'highlight.js/lib/languages/php';
// import python from 'highlight.js/lib/languages/python';
// import scss from 'highlight.js/lib/languages/scss';
// import sql from 'highlight.js/lib/languages/sql';
// import stylus from 'highlight.js/lib/languages/stylus';

const languages = [
  'cpp',
  'xml',
  'bash',
  'coffeescript',
  'css',
  'markdown',
  'http',
  'java',
  'javascript',
  'json',
  'less',
  'makefile',
  'nginx',
  'php',
  'python',
  'scss',
  'sql',
  'stylus'
];
// hljs.registerLanguage('cpp', cpp);
// hljs.registerLanguage('xml', xml);
// hljs.registerLanguage('bash', bash);
// hljs.registerLanguage('coffeescript', coffeescript);
// hljs.registerLanguage('css', css);
// hljs.registerLanguage('markdown', markdown);
// hljs.registerLanguage('http', http);
// hljs.registerLanguage('java', java);
// hljs.registerLanguage('javascript', javascript);
// hljs.registerLanguage('json', json);
// hljs.registerLanguage('less', less);
// hljs.registerLanguage('makefile', makefile);
// hljs.registerLanguage('nginx', nginx);
// hljs.registerLanguage('php', php);
// hljs.registerLanguage('python', python);
// hljs.registerLanguage('scss', scss);
// hljs.registerLanguage('sql', sql);
// hljs.registerLanguage('stylus', stylus);

// hljs.configure({
//   classPrefix: ''
// });

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  pedantic: false,
  // sanitize: false,
  // tables: true,
  breaks: false,
  // smartLists: true,
  // smartypants: true,
  highlight: (code: any, lang: any) => {
    if (!lang) {
      return hljs.highlightAuto(code).value;
    }
    // if (!languages.includes(lang)) {
    //   return hljs.highlightAuto(code).value;
    // }
    return hljs.highlight(lang, code).value;
  }
});

export default marked;
