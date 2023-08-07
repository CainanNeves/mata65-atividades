[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7985108&assignment_repo_type=AssignmentRepo)
# Atividade 02 - Renderização

## O Objetivo:

Aplicar os conceitos de algoritmos de iluminação local, seus controles e as técnicas que podem ser aplicadas para aumentar o realismo dos modelos.

## Motivação:

O uso de dispositivos de captura baseados em luz estruturada [1] tem se tornado uma ferramenta de grande valia para o registro de edificações históricas. Com elas é possível construir modelos 3D bastante realistas. Podemos encontrar vários desses modelos em sites como [SketchFab](https://sketchfab.com/feed).

No entanto, a integração de outros objetos a essas edificações deve ser feita comm algum cuidado para manter o realismo do modelo. Elementos como o entorno do modelo, as condições de iluminação, sombras, entre outros devem ser controlados de tal sorte que a integração seja o mais próxima do modelos capturado.

## A Atividade:

Voce deve criar um cenário a partir de um modelo de arquitetura (um prédio, uma fachada, um cômodo) a sua escolha.

Dentro desse cenário voce deve colocar pelo menos dois objetos 3D utilizados em CG para analise: um gerado a partir de modelos reais (*bunny*, *dragon*, *budha* ou *Armadillo*) e outro um modelo sintético (*teapot*, *suzzane* ou *mitsuba-sphere*), todos disponíveis no diretório *Assets/Models/OBJ*). 

Uma vez montado o cenário voce deve configurar o material dos objetos acrescentados no cenário. O material deve ser escolhido de tal sorte que torne o objeto mais integrado possível ao cenário. Para os modelos sintéticos voce deve utilizar técnicas de mapeamento para torna-los mais interessantes.

Da mesma forma fontes de luz e sombras devem ser criadas para tornar o cenário o mais integrado possível.

Geralmente os modelos de arquitetura (fechados ou abertos) não possuem um modelo do ambiente no qual estão localizados. Providencie uma simulação para esse ambiente externo do cenário. 

## A Avaliação:

Sua atividade será pontuada levando em conta os seguintes critérios:

| Critério | Pontuação |
| :--- | :---: |
| 1. Carregamento adequado dos modelos e sua integração como cenário | 1,5 |
| 2. Escolha, configuração e aplicação adequada dos materiais nos objetos do cenário | 2,0 | 
| 3. Uso de técnicas de mapeamento no material dos objetos sintéticos | 2,0 |
| 4. Configuração das fontes de luz | 1,5 |
| 5. Aplicação de sombras | 1,5 |
| 6. Mapeamento do ambiente externo | 1,5 |


**Pontos Extras**: Caso voce use sua criatividade e os recursos do *Three.JS* para acrescentar alguma componente que melhore o cenário voce pode ganhar até 2,0 pontos extras. 

## Penalidades:              

> Será aplicada a penalização de -1,0 pto por dia de atraso (verificado via data da ultima submissão no repositório)
> 
>> **Em casos de plágio (total ou parcial) todos os envolvidos terão suas avaliações zeradas**. 

## Referências:

[1] Bernardini, Fausto and Holly E. Rushmeier. **The 3D Model Acquisition Pipeline**. Computer Graphics Forum 21 (2002): n. pag.

[2] Peter SHIRLEY, Michael ASHIKHMIN, Steve MARSCHNER. **Fundamentals of Computer Graphics**. AK Peters/CRC Press, 5th Edition, 2021.

[3] John F. Hughes, Andries van Dam, Morgan McGuire, David F. Sklar, James D. Foley, Steven K. Feiner. **Computer Graphics : Principles and 
Practice Third Edition in C**. Addison-Weslley. 2013.

[4] DIRKSEN, Jos. **Learn Three. js: Programming 3D animations and visualizations for the web with HTML5 and WebGL**. Packt Publishing Ltd, 2018. (https://www.packtpub.com/product/learn-three-js-third-edition/9781788833288) 

[5] Three.JS - Manua, https://threejs.org/docs/index.html#manual

[6] Three.JS Fundamentals, https://threejs.org/manual/#en/fundamentalshttps://threejs.org/manual/#en/fundamentals



