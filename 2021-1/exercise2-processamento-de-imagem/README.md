# Atividade 2 - Processamento de Imagens usando Three.JS

Conforme vimos nas aulas de Imagens Digitais, são diversas as transformações que permitem processar os pixels de uma imagem. Nessa atividade vamos tentar aplicar os conceitos de de processamento de imagens para gerar efeitos em uma sequencia de imagens: o _streaming_ de vídeo produzido por uma _webcam_.

A partir do exemplo fornecido pelo Three.JS (https://threejs.org/examples/?q=video#webgl_materials_video_webcam) montei uma aplicação base no formato que temos utilizado nas aulas. Nessa aplicação base voce poderá visualizar o _streaming_ de video produzido pela sua _webcam_ no canvas WebGL da página html.

Sua tarefa consiste em fazer 3 versões desse _streaming_ a partir da aplicação de _shaders_ que modifiquem a imagem original. São elas:

1. Promova algum tipo de transformação na intensidade dos pixels;
2. Aplique uma composição de efeitos de pós-processamento fornecidos pelo Three.JS (https://threejs.org/docs/index.html#examples/en/postprocessing/EffectComposer);
3. Crie um novo efeito (diferente dos efeitos fornecidos pelo Three.JS), implementado como um _shaderMaterial_. Por exemplo, um efeito "caleidoscópio", por exemplo.

O _streaming_ de vídeo deve se manter sempre colorido.

Caso voce não possua uma _webcam_ para teste, pode utilizar um video pré-gravado (como no exemplo https://threejs.org/examples/?q=video#webgl_materials_video).
