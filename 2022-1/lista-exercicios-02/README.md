[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7566985&assignment_repo_type=AssignmentRepo)
# Lista de Exercicios 02

Com base nos códigos fornecidos com o Lab **02 - *Ray Casting*** desenvolva o que se pede:

1. Gere um novo padrão de fundo para os exemplos do Lab02, em que o fundo seja composto de um padrão quadriculado preto e branco semelhante a um tabuleiro de xadrez. 
2. Modifique o programa que mostra a esfera renderizada utilizando o algoritmo de Phong para que os valores que controlam esse algoritmo possam ser passados ao *shader* como parametros. 
3. A linguagem GLSL além da função [reflect](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/reflect.xhtml), que calcula do raio refletido em uma superfície, dados o raio incidente e o vetor normal a superfície, possui a função [refract](https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/refract.xhtml) que calcula a direção de um raio refratado, dados o raio incidente, o vetor normal a superfície e a razão entre os [indices de refração dos meios](https://pt.wikipedia.org/wiki/Refra%C3%A7%C3%A3o). 
Modifique o exercicio 1 para que seja possível visualizar o efeito da refração de uma esfera que possui um material translucido, na visualização do padrao de fundo quadriculado, como [nesse exemplo](https://stemkoski.github.io/Three.js/Refraction.html). A solução apresentada é baseada no controle que o próprio Three.JS fornece na definição do material [MeshPhongMaterial](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial.refractionRatiohttps://threejs.org/docs/#api/en/materials/MeshPhongMaterial.refractionRatio) o que não é a solução para esse exercício. 

Com base nos códigos fornecidos com o Lab **03 - Modelos 3D** desenvolva o que se pede:

1. As [superquadricas](https://en.wikipedia.org/wiki/Superquadrics), são formas 3D bastante versáteis, das quais os [superelipsoides](https://en.wikipedia.org/wiki/Superellipsoid) e os [supertoros](https://en.wikipedia.org/wiki/Supertoroid) são especialmente interessantes na área de CG [^1]. Com base na formulação matemática dessas duas formas construa um programa em Three.JS que permita gerar tais formas. Permita que, via GUI, os parâmetros de sua construção sejam manipulados. 
2. Uma vez que a geometria esteja definida, pense em alguns padrões de cores a serem aplicados nos modelos gerados. Algumas sugestões:
  - Baseado na "latitude";
  - Baseado na "longitude";
  - padrão "aleatório";
  - quadriculado.
Escolha dois desse e crie mais um seu. 
3. Seria possível criar essas formas no *vertex shader*? Pense a respeito e tente codificar.  


[^1]: Alan H. Barr (1981) Superquadrics and Angle-Preserving Transformations. IEEE Computer Graphics and Applications, volume 1 issue 1. pp. 11-23.
