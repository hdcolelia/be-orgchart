import * as d3 from 'd3';
import { ID3Node } from '../../../interfaces';

export class NodeItemParser {
  constructor() { }

  // dimensions
  width: number = 240;
  height: number = 150;

  defs: d3.Selection<SVGDefsElement, any, any, any>

  prepareDefs(prSVG: d3.Selection<SVGElement, any, any, any>) {
    const me = this;
    me.defs = prSVG.append('defs');
  }

  drawNodes(prGroup: d3.Selection<SVGGElement, any, any, any>, prNodes: d3.HierarchyPointNode<ID3Node>[]) {
    const me = this;

    prGroup.selectAll('g.node')
      .data(prNodes, (d: d3.HierarchyPointNode<ID3Node>) => d.id)
      .append('rect')
      .attr('width', me.width)
      .attr('height', me.height);

    if (!prNode.data.drawn) {
      const nodeG = prGroup.append('g')
        .attr('id', prNode.id)
        .attr('transform', `translate(${prNode.x},${prNode.y})`);
      me.parseAndDraw(nodeG, prNode.data);
      me.drawNodeLink(prGroup, prNode);
    }


    // if(prNode.data.expanded)
    for (const current of prNode.children || []) {
      me.draw(prGroup, current);
    }
  }

  protected drawPicture() {
    const me = this;
    // adding image
    const imageDef = {
      x: - (me.width / 2),
      y: 0,
      radius: 40,
      w: 120,
      h: 120
    }


  }

  buildNode(prSelection: any) {
    console.log('Building Node: ', arguments, prSelection);
    return prSelection;
  }

  updateNode(prSelection: any) {
    console.log('Updating Node: ', arguments, prSelection);
    return prSelection;
  }

  parseAndDraw(prGroupEl: d3.Selection<SVGGElement, any, any, any>, prData: ID3Node) {
    const me = this;

    // adding rect
    prGroupEl.append('rect')
      .attr('x', -me.width / 2).attr('y', 0).attr('width', me.width).attr('height', me.height)
      .attr('fill', '#044B94').attr('fill-opacity', 0.4)
      .attr('rx', 15)
      .attr('stroke', 'blue').attr('stroke-width', 1);

    // adding image
    const imageDef = {
      x: - (me.width / 2),
      y: 0,
      radius: 40,
      w: 120,
      h: 120
    }

    prGroupEl.append('defs')
      .append('clipPath').attr('id', `def-${prData.nodeId}`)
      .append('circle').attr('cx', imageDef.x)
      .attr('cy', imageDef.y)
      .attr('r', imageDef.radius)
      .attr('stroke', 'black')
      .attr('stroke-width', 5);

    prGroupEl.append('image')
      .attr('id', prData.nodeId)
      .attr('x', imageDef.x - (imageDef.w / 2))
      .attr('y', imageDef.y - (imageDef.h / 2))
      .attr('height', imageDef.h).attr('width', imageDef.w)
      .attr('xlink:href', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGBUXFRgXFxkaGBoXFRUXGBcVGBcYHSggGholGxcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGzAlHyUtLS0tLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMMBAwMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAFAAIDBAYBB//EAEEQAAEDAgQDBgMHAgQEBwAAAAEAAhEDIQQSMUEFUWEGEyJxgZEyobEUQlJiwdHw4fEVI0OSM1NyggcWJLLS4vL/xAAaAQADAQEBAQAAAAAAAAAAAAABAgMEAAUG/8QAMBEAAgEEAQQABAUDBQAAAAAAAAECAxESITEEE0FRFCJScTJCgZHwYaHRBRVTscH/2gAMAwEAAhEDEQA/APDkkklwRJJJLjhJ7AmLrXRouORqOA4rC08r65zZmPDm5M0EOblt5Zrrv2HC1qoNMuphxM0zHhAbNo2mFmgRHl+6JYHiuSHZRma0tnoSIne1/dOpexXF8phbivZh5JdSgUmhgEuPk5x9pPmhXDWOz1G0Hua8h4AFw5gBL/EOQEi10ZwPGjJyeNxFgJFzZVsNhmipnuLzAcS4kzmlwixm46Jmk3dHJS4ZT4uw1BTeKDmvdd5uQScrGgNjwi1uc2JQ6uwvqZWsymcuQbEWi/WV6FT4tQptLWNLnkRlADQJES6NAPfkg+A4CKdVlUvDQHF3iIM3sMvluudP0BT9g/g/ZKvXggtawta4ONwQ6dI1cIuOq0eO7KYalemXZ4cLguAJ0dYiCNkT4fVoUWxTObeBMSd+Q9FzH40ZhnJMXysGnnzTYRSEUpykAeymEr5SKgOVhJYXHQmzhra0H1R+tjG0xYZnefhC47iAdZoLGnUuIk+myYcRSMNJL/KwA8zqhdpWRZQUnd/z7jTj650IbP4QLeqdUwRmXPLj0M+isMblF3Na06E6pHFs5GBuRE+SXCTd7le9TUcVG/2JcHUc2zafmSYVt1MO+LXoh1XiLSDDj0AEn9lVfjn7hrI5m/sFdTS5ZhlSlJ3irB7KAIFvNcc8DVAGcSeSSRMaQP3KgxuMqOghxB5BHuoX4So+UF8bxZjBzPJUG8WebmGN9z6WQ7Le9juTc+yfTp/9R5GAllKT4LQpU48otYbiDi4wwk7Ek/rp5K0OL5fiaC7SAVQe6pECzepgn2TGEjUgeVz7pXdqw8IxTvYKjiMtJIy9NvdMdxwxbXyKGGZ3IHOy6/EgCbAbRr81PtRKvqJpWTLVfjI3d9VTrcUbp9QqNTFeR9FWfXdMgD1VE8eCMlm7yI61bxu7toYIuDdrifyaDzCF4qo4kB4i9jtfm7dEn1HS5xEEwDYR6KF1FzrOFtht7JJbHjGw+niHAANpuIixGh9wkov8O5OeOgJhJDYxn0kklMUSSSS44SSSS44SmpvGhA8991CutQCgrwqlnc0MOVzQSS4xPl/daLDYFoIL3Of+Vlp5eL+qEcNoUcRXILcrO7gCRIcIaCeY5kc7q9U+14OkAGtc0zkqCHZQBJH115J07Bd7WIsfWc2o1rgyk0uEMn4Wk3c70vJV3D4hj6zqVNpe5v3joY1IHJZnHVX16pfOdxDZgRcNFoPLmu4CuBVJqPeww7xN+KSI9jcLs2C2ja/YnONzPy+StYekROWIEg5oNx0B1WYocarmhIqeIeBoaG3IPxOJEz5dEK4dxCrTqZg4zJL983PMN90ckFN+DaViAZcC/wA/0GyrOqEk5RlHzQjFcdBgl0zyEf2UuHxweJafTceaN0PvyXw+DIMH3UzMQNT4z1mAqBqHmmfaCNEfuc16CMvHiDsvrCi+0g/FJ/nMqgajjqUwtSseKYWGJEahoTnYymPvE+Tf1KECkTpKnp4Ko7b3U5TiuS8KU3xcJt4hSBnISepThjpM5fmAqtPgdU6QrFPs8/7x9gl+KpryGXQ1ZcodUxQO4HlJUD8V+EHkn4jhbmfdMdUPq1iLKkK8Z8MlU6OUOUT1a7oiLclWzEnRQVKxULq5VM0Q7bQR7vmmuFkMr40tGvkuUuJMc0gg5tAAee6DkdiMxuPAmLkW6TzQuliXNJOYzf8Al9lPhK7GnxMluVwneTuq1YAk5GkN63PqpuVwNFwcZf0XU2nwSs4BwZIIBBBG/mUl2R2MvQNSCSS4Q7CRCfTcpKozEutOqAbFddShIBEA7uzcgEgRJ2vomgK3gsW6mSNWugPYdHAGYI6LUYLD0O7cKgbmlgpvaQBDiYdycBN2kH4fJAeMWzM4Jpb/AJhzAXDXDZ4gj5FHKL6uIpZ6hL20y6CSQ2w1IFlvMJQwhotpNomo0CG+HpGYvcAJ6/JS8K7N4ejSAq1AQyXGSA0XnM78RHM2tokci8aaT2ePPquz59DMi1vTpsn1GOzFzrjd2rZI5hHu2telVqnuSwspgQWknNmOxMTAjQbnkiHYzgVOrSqCpUYWv+7MPbtnjbePJFysrsWNPKWKMU4AGxlPyunTKYnlbndbmh2TbSxbWGkalJ5LqcOBI7sSBUMZQx5BF7xKD9q8Dicxq4prKU5hTYI0ZYBrZzBm4JXKVwOm1yZ6rQIsfinTdWsG2q1ucNJaPiVbEZNGZjG5tPk2Lb7meiMYbjD2ZC1s0gAzKYJJgZoPnp7ItvwdBK+y3TbLQ4GZH8CfkRjFUG/dhOwPCS86wOa5yaWzTGCb0BGUpNgSi+D4O8gHuzfTMYHnzK0OD4RRpi5zHyV12MaBDWtHpdZpTlPSWjVFU6Su3dlTCcKhsHI3yBU32ED7/s2PmuHiJ81C7HO5JOzHyF9TUfBPly/eKY7ENgeJ8+QVR+IeVymxx2KLjTSFU6rel+5ar4hrxB+aoVOE0jcESiNLAk/c9yVbp8PF7NtYxsYmDexghZpKC/Dc2RnU/NYBM7PUjqZ8iosV2XYfhJHndFsbxLD0HZX1A0gSbi3SNZ0T+GcVp1wTTdMajcA6EjabpH3FtNjqpTfyySuZPFdlqZ1cTE/CP3QHB8Dpvkd5Dg58tiTDSQL8/wBltcb2jotL2NLS9sgg2Exuem8XWSodpcg7tgAAsHZRckkl0ai5MXNitVJ1mncw9R8PktGexuFdTJa4Eb+h0K5ha0SNjqQL25HZFuMccdUblJaZbDrX10HIWn1QJpjRbI3a2eXUxUvlei451TbMBtBMJKnn6rqNgZoZKRCTUnJiRxPBTF1AKCHDKTH1GMe4NExMEgkusHAXg6SNoW0xv/h5mqjJUYxjgesETIaN4EG8LEYYixmIIk7xYWGnzC9X7I8WOIy5iIpyLNI0yw4kk+W1zvCnO62aaSTVrGPwHYx1Wm9zajc7a1WkJsHlkAeV838CL4TgUVcjmsYaQBdlcAC54AaBm3jMSOoQ+jx11LDNzeFtSvWqMLBNWW1JuXQxomB949EG4hgA/FhoqCajmEBzjUc0vI8L3OF3BI4t+SsKkYpWjs9Ew2FN8hecrix2hhzTBBg6rK9ssGabw6vXc6m4k06Q1EDW9oB9dFocTjaeHxIZXpVKVOo0N7zNFMvbEPDfu2sTrp5oP2/4FrVo031Gt/4lXMXMaA1sMGwAzCT180sHZ7ZSracdLZl8AO7IeymKrSPhdu64JEXjVHOF4ttR32hhZRcAWloEiBf7ztI6bITw3gmJrMIYxwDZgBp8RDoiehBCfW4bVp0s76Jlpguyz8Ox8ryeYVHKL1cnCnJbtoP0uL1QS/vagLos1pb4WzlGk7k23Kq47EPrNLCSGGCSQC9x5yb+pQjAUMVWdnpNe5uZoMXAJ/FyEA9FquH9n67y9r2hhYQDLgAZEgjpCSU4w5NFODqaMtU4QyTFtYGwkz8hZX2MApinq0c/Of55LVt7I/irUx7lPPZOlb/P84puPtdT+LgWXRJGaoD80I9ghUEEusi2F7O0BENqPPMw35XRjD8HFg2kPUklSn1V+EUXTxS2zP1a86BR+i2LezD3XMD0Vml2aY3W6XvNrgnjTT5MfhqE/dROjwsHUFamnwtrdGp5wg/EAoycnwUVSCM8zhFMKvxLE0MM0ucNpvYawAXaCTACP8QNGi3PVqgNkNnmXGAB1Wc7T9mDjXUctQNoNzPMOkv8I7vaIJJnoOZRhTbksuBZV1Z4nmr+22JpuJim4uEjU5bkAE76e6r8H4ti2PY9p8JqGnV8eYOc8Al5BMAgRBsPCjHaPsZVpYnBNpOl7w1ubVjHsMktnQAFzo/KUQ7Udkq9EUnYYB9MeFwgudndb7S+T4nZieeWAb7eglTtryee5VL3bejzvG1A51V1RxNSbGQZMwWkwBbmOSt4J5pU+8p1iyplJtMPEgCnEfEDmM/qiTuBmkKNOvVosfmcw0zBysY7MXPcDaSXAxfSN1V4k6hmDqTC3LDW5ntLIpEFzvCMxJMbDVV09ELtO4Ko5qhqOc1znOaSC0j4sw8RG41HqqVRkHeDpIgkc0X4blpVmis1rmuDZ3EO0c0g3Ikz5Hktq3s7QqszuOfP3j2vLzUJaWHw5zHwmCI5GVzkoiqDn9zzALi1nEuxdSnQZUb43ONwBBbNg3UyZQTh3D81VjXQ3M/J4jEHTOejT9ITKSa0I6ck7MvU+C4UgE40AkCR3eh/3JI9iexjy7wvpEQ2DncJhoExBj3XFHuR+o09iX0mEYYMhPcZ/nVRykFcxk5ogEeIHykx5/0Kiy3V3hmAdWORmoBNzryHmdAjGI7M1qVMveD3geGBttQJEfiEXtpF0rkk7FY03JXSKvBODve6mT4Wud8Tmy0QWySIvuI6GV6xwbgYpEOgElrQSLSRu4bkzuDGiz3YnhNUtcH5cpLix4gua4CHDQxeDBjW2pXoNKjoCZNr/qs9Sor2NdOk0tI834JiarOHU6dCh31R9TEMNpDRJlxOgNxE8in9muwr6WMoOqFpaGmo4HmA0XH/AFPiPyTutN/4a4YGhWafuYmu35haytwqk8gukETBbUc10OiRLSLGBboknWs2kPCjpNmH/wAXxLMS7C4qgH96YwkBjmiHOyuqGb2DSd/Dotpw44TDUW0RUaW023DRnPNzi1gMSZOm6B4rglHEYvI1zgzDtBc4uNTNWqfC0iqXNIbTkxH3wj1DhsANfWdUaIhmVjKdtJZSY0Ojk6RZJKSfI9n4I6OGxFZz61NmSi8UwzN4a7mAElzWEQwkucQHnkYErNdusDi/8pmCo1Q1jS92ZwynJLsndknvHWmTN4i621SsTuUwJVKKd7HWn7PEO1rsXh69GpUeaNV9NrnNYWtyODjILKbjaIN9ZK9Z7Ldn6tSkftZAqNcWyPhe2Glr2+YPuCpuMcBw+KAFekHwZB0cNJhwvBj+QEfw+KDAAGCAAB0A0CaUoS5R16kfwsZQ7J0RrdWTwCiBZqceLO2aFBU4k87+yD7fomn1De2PHDKbfuhcL2t0gKs7FHefdROrt3U9eEVUZfmdyariHcyq767uZ9011ZnVRuqM5lG7Dijj8QRqT7qCpiVI51Pqo3Mpn+y7JhxRl+2+BfiaTG03DNTqNfBkAiC0xBFxMjyWRpYvG4UvoOLnUQ2o6lLiQTILGtib5j8J3XqLsOzkFWrYNh2HMfz3Txr200B0E+GY2h2mxDKvcPqZ61oY8AXNMPEOHhEjO3WxjbTnEu3rHMdTpVMrpyOqOY4BgjxOETJ2F9Ysqvb6hTp1qFRrYqyPHd0Bp8I7sfEZMeqzL+FVwG0O77uk8hznloBcW85IIEkDKNytEcWk2Zpxmm0mRcedhHMd9nAOQNDnukOe57nSWjkLXXOGmriagcW58vdFxAAa1rC4ZYZYAgkaLhwdSk0VHkFoGgvDw85Wuv8AFodCqnCuJllUvdcFtwLXmxgam591W91oi4tNXNH2owuBa5jwRTIB8DAB1aYbcQ62m6H4PtI5tLuGBsh5LQ0Fwc4gguaIkb2n72yG8ac+u81Gs8DQADEWkAE+pVvBYF+GHflocQTIBFuhnWdQRe26GrbDaWTaWvY9/a3EvouoPhwJ1IIIvOQ5evXpdB+JYh1V0vJJY3KA0AMa1ugA2EzaN1aw/FQXvIpsaDBiRZw+8C7QxPqo+IOzUg9oytJLQ0SS6CSXOO9yUUknwK25R5uV6XEnAAB9QAbB5A9klew3AwWgufBOo5JJXOmOqVZgBdC4psPRLzlGuw5nl5qzMiTZpOxHDm1arXlwb3bgTJ1P3RBtEr1sukgkAkGR5wRPsSvHuDcJrNcHNd3T7ZA8FoeZMtaTYke116nwqoA2dHH4xIMO3uLLF1Et8nqdNBuO9BilXI0AEmTYa8yp24p3T2Q04gC/K6p0eN0nOy5iDMCRYrLmma1SkV+wOKc37awRbF1Tp+KP2WqfjIBLjAEk+QuSsN2Rq/8Aqce0H/Va7X8QeiPH65eG4ZhOeu7Ify0xeo/0baeblSbWdicISwuFOylU9x3rvirvfWPlUPgHozKjgxKHdxlAAggAAAGYA0C5Qp1jc92xvUkn2BUZVU2yqou1wqK5ThVKrNqtAi5PPQe1/qutrKbqhVK5Z7wpd4VG6vA0LvIE+8KB/E41pVPMMJR7h3auWzUPNMNTqqB4yw6Uqx8qTkR4dQdWaXtaWj84ibwRGtuq5Tb4OlBQV5aIjUTXPCsVMG4cvdVKrI5IOo0FQjLga5ybKiqYhrdSB5mFXfxmk377fQg/JL3inw79FwtTCQFQdxlh316KnV4ow/f+SXuzZRdMvIYNZqifiWjeyzOPx7SwhtTXpfyHmYHqsbiOI1qTn0xUhoIBJmLi72g6C8QOivShKp5J1lGl4NtxrhdCtUFV9VxIsA3XKACGiLjxAElUMQM1Du6ziSWtJMFzmuBBytnUWsSfOVn8LximWgOdmfvlGpVhnFmx4C7keSvjNaIrtvatsCY6jiKdIuLnBpObK7Yk5pgaHz5oMR3Rgsl0D4tBcGwGoIkGeaO8X4pmimzMc3xF0QWjby/ZCaOMJcQBmJESTaxtpFoW2Dk1tHm1oxUtMtYjtLVfTe0hozWblaAGiRIHSEIr4t7zL3l3n00EKF7jJTFSMEuEZp1Zy5ZbwWGD5BcGmPDINz+G3SVMyqWQyM0XgzZ0k2HkquFxLmSWugqWpjpeXkAuLSCepEZrbwud2wxcUr+R7mk3c54O4ylJPZxmoABDTFpOfb/uSS/N6KXp/U/5+oMTwbJi60qhlRtuxHEHPc+nUJe0gvbvlfPxTq0+W6dxfCvw1ZlSi90TMuJ1m4cREhZJmOcIIsRuOfNdxeOqVPje53mbeyzOi+5kuPR6K6qPaUfK8m9r8bqCm1zq7SDM5RFxeJmTaFFwrEU6xsXO5gC/rK88C0PA5YC4H4twp1OmSg8Xs19J1rnUSa15Nb2ahmNxgaLDu4RXhdfva9WuTZv+TS8mmajvV0D0XnfD+K1GmqWO8dV0dd7+krR8LxL6bGsa5oAECfqs1em43fnS/wAmvpF3bJcK7/u7G6GIUzMSIWRpYuof9RntKt0sS7ep7ALzJ3Xk9SPTf0NJ9s5JzcaQgQx45pw4qwGCQPVTyk9JDPpjQsxxRDDPqO0B9ll8L2ipNfHegbaAgdZhNp9s8SKpbSqsLZs4sibaQtFOLW2Zp9NUm2qcV+p6FTwVUjVxt1H1Q/GNqN1JaOpjzRjs3icTVYHOqMcIEkNi/IXVftdwajWBLoD9nTf2WqpBKnmrniUq2NfCpb9N2/6MZiuMNBINUW/MqVTjDP8AmD3UGM7P02E564FtAAD8ygVTBUw6M89CQ0kLGop8tn00KVJr5X/4HKvFaZ1e0+oUDuI0vxM+SB1aNJoJ+rgVTfVZFsvuFWNNP2GVFLyjQu4hS5tUJx1M6AH0/os99tAHxAeoTH4sa5h7qyovwQajbk0oxg2AHpCG8be2pTIJ5QBvezfKY8kIfjRu4e6qYziAa2QRO37q1KhJSTMnUSpKDuOwXB2928PcA4u8JHIbxuDdF6VLDtAkkmIOt7RdZajxSAc0k8tlUrYxzjM+y1yoznzI8qPVUKSWMbmg4nicNLmFpEtABGut7G0KvhX4ePA0yA4S4iSTvAWecV2m+CqqjZWuzLLrMpXxX7HazCCQVGpK1UuMlRqxhla+hJJJIgEkkkuAJJJOpxN9N4QCcXU9zRNlfo8PDqYfmABN52g6T5EH3QbS5KRhKWkDVbpY5wECIHRco4bMDE2BKv4TDBjKj3t+44NkCMx0PzQlJFKcJ8oHYauWGRE9VcbxZ8bStZ2YwlJtBuakHOMuJIadTbXpCOsFMaUgPQLHU6mCdmj06HS11BYysedN4tU2+Uqw3imIIgB3o0r0VjxtTH89FPSq/lCzy6ql9JtjQ6n/AJGeZuxGKd92p6NP7KB9Wro7N6gyvWg4/hC40TsPZL8ZBcRG+GqvmbPJqGcaA/NFsG+oDIDweYBXo9OkeQVvC0RmEgQpS6yMtYmuhGVHeRk8B2ixjGZGmrER95CcViq9QmTUJ3u46L3jgeDoEGabdNxKF8XoUgTlYweQCFlFZW5Jw/1KEqjhGnZ+9HguJweId/pvPoVXfwnEn/SefQr1quwybn5Ku5juZ9x+6eHWPxEFbps9uR5WeB4o/wCk9N/8u4r/AJTvl+69ReHfwj902/P6Kq6yXoyS6GP1M8sqcAxIMd076qdvZPFH7g9XBekkn+R+ygqOd1903xsvRP8A26Htnn47IYr8Lf8AeF3/AMnYn8n+79gt1J/N/uQzi3EBSEkOcQJIBNmyBJ5Jo9VUk7JCz6CjFXkzLVOyNdoJLqcC58R/+KB9zcgXibjpvdaz/FqeIY5khhNryTE3LRvZU6tTDU6Lu6Ic50iSDNomZ0F9N1qhUnxJbMFShSe4vX3AGHw5c7LMHr5SozSP1+WqIY2kGd3HxltxGvz1VgCn3eWQ1wFzldN9QSq5mdUk7oCELilqOAJA0+ajTkGhFqdTaJvYc1zMrOFpzIMxtcC+0yuegxV2cFOnu76/suqT/DahuAPcJJbx9lcJ/SUF0GEoSATkBxqEqRlchsSYmY2nmoYVzhuFNR2UNkwfPzCV2S2PC7dkPweKcH5hE+VvOFf4xiXuptBy3Nw07xvC7w/gtTvW7AeKb6clFjcGXYju2TYSZ2MSZj091LKLldGyKnGnZ+dG6wFPKxrY0aB8leE8lS4VTeGNzmXc/wC2qJBi8ia2z3YPSHsJU1IprQpKQUpIrGRI2U5spzR0SaEqiFyHsJVigTIVdgUtPVTcbO5RS0bfs46zj+VCOLPElTcDxESJjwneENxrrxdaHL5UeZSpW6iTBNcG6rOaVaqlQOUoRPSlPwVqjT1UWU81ZeVFKskRcis8EAm51gc+iy2L4tWAbmyszMLonQHQkQTbXYXWwcCs9Q4OD9oc4kmrmZLtQASDl5NJ25AK9LBXyM9ZzdsDN4rjT6ZexxLicpkEHUTvI68uSB/aXOJ8RBdA1N9rz6nkjH+HRUbhnNswmpVfrLAPCQdhlt5lQ8L7Pury9py0w+BMzlnUei9GPbgrnj1HWqSsDRh4JzGwOXM0ggHnbUKWGtJyFz2iJeW2E6y3krPG+Gig0NLwXhxIaNchFifZUznFPM0wx5LSGm1tndTqqJ5K5BpwdrEZxHizaGbERYeS5XrF5AHS2gn+HVdwGDNV2UGDFpR7A8AaL1AZgW2m+YeRtdCc4w5DThUqcGZq0y0wRBuI6ixCUW0H6/2V/ilM0qrwNHA63sdbneRqoH4eMokDNfUWG38KdSurknBptFUBStf4YgEc9x6qQ4aX5W3ibk2MakFVnNiOqPIu4hzC0nFoIcR/3BcQYViLSfdJS7ZqXVJLgL4XAh5YXDw6HXYfJVcdgi28aWcf18ohX+AY052sgRJPXTWUZ41h2EMeWSWuEj8Tdx+qVzcZ2Y/bhOndGMqUiCRrGseyv8HrAVGXLBIzEHaQb7xZWG4SC9zbtvYGDkLh7/8A1KgwWGzvDRYl0DMPCbbxoqNpojGLhJNHoNjDxeRqLzyWY7NnNia7zrJ/9xH6I1hppUHZrZA4i9oaCfDvB6oP2JoyKlQm7nAe1z9QscUlCR6E5N1YfubCg8dPn+6siFWptG4U3cs5fp9FlcUbc2W2BSsH8lUhhm9SOUmFNSo7SYGw/eUjih1IuNSzcr+oVQYe8y/ylNOGi7nH3/ohihrl7vI2PspKZv8AuhRa5ps+BsCQfaQpS550qT0LQPoUjiiiZoMJUvYj1dAPRR1nXN/1+mqF4djpkkHqJ/QpmIc+dQSORMx5ErsdHW3cuO8pKicEPrYmpPwuA89fTKmNxj4ufSP1TKOhZMvuCiJvqVUdjiLOaR1tPpBSZiR+f5/qnSJbLJAUbh0VfP8AmPlb6ymOrEHUxyhdYJI+mL2FxBMXI5FMLOVgmnFNIk281HVqg6O9iFwGjKYjgT6+IxBqSNO7dFunmIEJcR4IaeF7un4nFzS7qTAMDYaey0+fr8x+igqvtdae/LRk+Fhv2/JnuzXC8jM7mw92k7N/f9kWBm2hG36+Sk70xtHRRVGZiDB/nkg5uTuxo01TjigLxbhRq1WmbZb+ht7z9VWxvA3OLS0jwhrb/l3COU2uu6Tc23sLb+qcQ7mJ8v6qyqyWkZ5UIO7fkxz6bWHK65g3kxM6NjXayo5DytzRzibC7EMYRlAuI3F3E9Lz7KziaJcMpEgmeRHM+av3LWMnw7le3gCtx5AgNb6hJXTQ/KTtNtkkc0N26nv+yCWFwDGfDq0m51J/gRIOLtW2II99fXRUKFbMAb/15/VTh4aLG/n81GSfktFpcEVHANLZOab/AHrSLG215VrBYZjZGS8zO/n8lBRYB94dZjXdSvqDMDLT/ZLK5SKSF2lxZbh3D8UN663UnZpmXDsneXe5/aEB7UYgOLGjqTfnYfqjuDqta1rRNgOXJFxtTSJxles360GGVxz+ZCkZiTMR6zKGNxt9R7T9FMMSIs72t9VBwNakFWYvynkrTMS7p6oC3FxPw/r9U+hihJ3PVx+iVwKRmg2cWear1cULGRO90N+1P2gfzqon13Tf1t/RKqY+aCn2p2zvZSMxxmzgekIKS7kBP83XabngxPt/QLnTHjM0lPHt1Eg9B9VyvxEbZ56iflIhBaVeBJGm/wD+h0UhqN1nXlEfMJO2UzRfrcS5AH5KuOIujxA+8/qqVVs/hP8AOUKsC2dhzIuZTqmiTqIKDE099V0127fVDBigBEz5AT6mE1mIH4Z6WH6I9ti5oJVMQeU+o+YTBWA1Ee/9kMq12m1x0hc74Cwc35/shgdkgo9zdx8gonOZr/PkqQrA6n2JKiLm7Fw9f0XYhuXXPGwHqFXqu8/56KJ1QfjHkoatTk4en9UVEVsnz9T7pr8RYjN5f2VPvTz/AJ6rkmLkD0Kook20ywytHy0Se+dyFSqu66/zdNFSNyE2JNsndSvmtIsD0KgdUAMkiYhRHEknVR1H+SdREbsdfiL7pKF3kPmkmxQmZYbiztEAJ7a0jSUBdijslTxZAsr4GXuoNPxOUEwN4lQ0OJyZI9huhj8cS3KQD6XCipVYttKGGju9vRe43/xW9Wt+pR9rdJ9NVlMbiMzgeUD2Vv8AxNx32sulF2R1OolJ3NI0ACSoKD8xPhlAcTjTAE+abg8WQdSBqk7bLqsr2NSypBIyqShibmWi2msoFRxU3Jn1/YpvfNL2gWvc9NtSp4Fu4HX42TGaPVcfieZn3QOrioqWix809+LM3MW3/uuwCqn9QyK0jWE+k/WIWbqYvSSL8h/VT0HGJk+UtQdOw0aqZo24gsuWyOUOP0UT6gcZiL/mH1KH0cQY1G+rm7eZXH4lsa+1/olsUbdi73jtj7JjXuGpPuZQepc+Gp7uASZiKjd2mObm/qVTD0RlPews5xJ1+c/VMgaz+n0VEcV/EwDqMv6NTW45hdqPVDFgziEc0Xke5/VNOI8vSP1VQvkw0g+TgVF3pv4guxDmXRid5gzF7fRO+1nT+qG06ki/NSvcAfij+dV2KOzZYdVI2B9P6qN9b06if1KgL+vt+yjrVbaoqIrmWO/IvK4cQY/n7qk2sDvH85pPcOabFCOZYFb+So3VZTb+nmo3PjX+e6ZJCOTJ21J3TXO6SPP9FGHD+f0ThGxRsC4i/wA0lyf5CS4AIXUklYwISTUklx3k45OlJJccuTrinsK4kg+Ci5JaTzK5nObVJJKUvo4x1/VS4h5nVcSQ8jx/CyBxU9KqRukki+BKbeRZq13QLnZR0qzue3RJJJHg1TbuLvTOv0UTqhnVJJMiU3oUzYpmX9V1JEVj8ogFNkzqfddSROloY5xBS751rpJLiSbLWHqkuF0uIONhsupKf5jS/wABDQKme3wlJJF8i/lK9M2T3VTIvokkuZ0RV9QonhJJOiUxmYpJJInH/9k=')
      .attr('clip-path', `url(#def-${prData.nodeId})`);

    /*
        prGroupEl.append('rect') 
          .attr('fill', `url(#${prData.nodeId})`)
          .attr('width', 60)
          .attr('height', 60)
          .attr('stroke', 'blue')
          .attr('stroke-width', 2)
          .attr('rx', 25)
          .attr('y', -20)
          .attr('x', -60) */
  }

  // Generate custom diagonal - play with it here - https://observablehq.com/@bumbeishvili/curved-edges?collection=@bumbeishvili/
  drawNodeLink(prGroup: d3.Selection<SVGGElement, any, any, any>, prNode: d3.HierarchyPointNode<ID3Node>) {
    const me = this;
    if (!prNode.parent) return;

    // Calculate some variables based on source and target (s,t) coordinates
    const x = prNode.x;
    const y = prNode.y - 2;
    const ex = prNode.parent.x;
    const ey = prNode.parent.y + me.height + 2;
    let xrvs = ex - x < 0 ? -1 : 1;
    let yrvs = ey - y < 0 ? -1 : 1;
    let rdef = 35;
    let rInitial = Math.abs(ex - x) / 2 < rdef ? Math.abs(ex - x) / 2 : rdef;
    let r = Math.abs(ey - y) / 2 < rInitial ? Math.abs(ey - y) / 2 : rInitial;
    let h = Math.abs(ey - y) / 2 - r;
    let w = Math.abs(ex - x) - r * 2;

    // Build the path
    const path = `
           M ${x} ${y}
           L ${x} ${y + h * yrvs}
           C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs} ${x + r * xrvs} ${y + h * yrvs + r * yrvs}
           L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}
           C ${ex}  ${y + h * yrvs + r * yrvs} ${ex}  ${y + h * yrvs + r * yrvs} ${ex} ${ey - h * yrvs}
           L ${ex} ${ey}
         `
    // draw path
    prGroup.append('path').attr('d', path)
      .attr('fill', 'none')
      .attr('stroke-width', 5)
      .attr('stroke', 'steelblue');
  }



}

/*

export const NodeItem : INodeItemDef = {
  properties: {
    title: 'title',
    img: 'img'
  },
  size: {
    width: 120,
    height: 80
  },
  components: [
    {
      tag: 'rect',
      attrs: {
        x: -50,
        y: 0,
        width: 250,
        height: 150,
        rx: 15,
        ry: 15,
        fill: 'gray'
      }
    }, {
      tag: 'circle',
      attrs: {
        cx: -60,
        cy: -0,
        r: 32,
        stroke: 'blue',
        'stroke-width': 2
      }
    }, {
      tag: 'image',
      attrs: {
        fill: `url(https://picsum.photos/200/300)`,
        width: 80,
        height: 80,
        stroke: 'blue',
        'stroke-width': 2,
        rx: 15,
        x: -80,
        y: -30
      }
    }
  ]
}

*/