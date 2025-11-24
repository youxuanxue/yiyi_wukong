import { getDb } from './db.js';
import { PaperData } from '../src/types/shared.js';
import { v4 as uuidv4 } from 'uuid';

const samplePapers: PaperData[] = [
    {
        meta: {
            title: 'Back to Basics: Let Denoising Generative Models Denoise',
            authors: ['Tianhong Li', 'Kaiming He'],
            tags: ['CV', 'Gen AI', 'DDPM', 'AI system'],
            date: '2025年11月18日',
            paperLink: 'https://arxiv.org/pdf/2204.06644',
        },
        sections: [
            {
                id: 'intro',
                title: '简介',
                type: 'text',
                content: [
                    '当前的去噪扩散模型实际上并不以传统意义上的"去噪"方式工作；相反，它们预测噪声或噪声数据，而不是干净的图像。',
                    '论文认为，预测干净数据与预测噪声数据在本质上是不同的。',
                    '基于流形假设（自然数据位于低维流形上，而噪声数据则不然），作者提出使用直接预测干净数据的模型。',
                    '他们声称这种方法允许看似容量有限的网络在高维空间中有效运行。',
                    '论文展示了简单的基于大块图像 Transformer，仅使用像素作为输入，可以成为强大的生成模型，无需分词器、预训练或额外的损失函数。',
                    '他们的方法在概念上是一个"纯图像 Transformer"，被称为"JiT"（Just image Transformers）。'
                ],
            },
            {
                id: 'problem',
                title: '解决问题',
                type: 'text',
                content: [
                    '当前去噪扩散模型预测的是噪声或添加的噪声，而不是干净的图像。',
                    '由于自然数据位于低维流形上，而噪声则不然，这种方法可能导致在高维空间中的低效建模。',
                    '论文旨在验证直接预测干净数据是否比预测噪声更符合流形假设，以及是否能在高维空间中提高生成模型的性能，特别是在大块和高分辨率的情况下。',
                    '论文将此称为一个"被忽视但重要的基本问题"。'
                ],
            },
            {
                id: 'key-idea',
                title: '关键思路',
                type: 'text',
                content: [
                    '核心思路是"回归基础"的方法，其中 Transformer 网络直接预测干净图像（称为"Just image Transformers"，JiT），而不是像传统扩散模型那样预测噪声。',
                    '基于流形假设，干净数据位于低维流形上，而噪声则不然，因此直接映射回干净数据空间更加合理。',
                    '该方法不需要分词器、预训练或额外的损失函数，使用像素级大块 Transformer 进行端到端生成。'
                ],
            },
            {
                id: 'figures',
                title: '核心图表',
                type: 'gallery',
                content: ['1', '2', '3', '4', '5', '6', '7', '8'],
            },
        ],
    },
    {
        meta: {
            title: 'Attention Is All You Need',
            authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'et al.'],
            tags: ['NLP', 'Transformer', 'Deep Learning'],
            date: '2017年6月12日',
            paperLink: 'https://arxiv.org/abs/1706.03762',
        },
        sections: [
            {
                id: 'intro',
                title: '简介',
                type: 'text',
                content: [
                    '主要的序列转导模型基于复杂的循环或卷积神经网络，包括编码器和解码器。',
                    '表现最好的模型通过注意力机制连接编码器和解码器。',
                    '我们提出了一种新的简单网络架构，Transformer，完全基于注意力机制，完全摒弃了循环和卷积。'
                ],
            },
            {
                id: 'architecture',
                title: '模型架构',
                type: 'text',
                content: [
                    'Transformer 遵循这种整体架构，对编码器和解码器都使用堆叠的自注意力层和逐点全连接层。',
                    '编码器由 N = 6 个相同层的堆栈组成。',
                    '解码器也由 N = 6 个相同层的堆栈组成。'
                ],
            },
            {
                id: 'figures',
                title: '架构图',
                type: 'gallery',
                content: ['1', '2'],
            },
        ],
    },
    {
        meta: {
            title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
            authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
            tags: ['NLP', 'BERT', 'Pre-training'],
            date: '2018年10月11日',
            paperLink: 'https://arxiv.org/abs/1810.04805',
        },
        sections: [
            {
                id: 'intro',
                title: '简介',
                type: 'text',
                content: [
                    '我们介绍了 BERT，一种新的语言表示模型，代表来自 Transformers 的双向编码器表示。',
                    '与最近的语言表示模型不同，BERT 旨在通过联合调节所有层中的左右上下文来预训练未标记文本的深层双向表示。'
                ],
            },
            {
                id: 'results',
                title: '结果',
                type: 'text',
                content: [
                    'BERT 在 11 项 NLP 任务中获得了新的最先进结果。',
                    '将 GLUE 分数推至 80.5%（绝对提高 7.7%）。'
                ],
            },
        ],
    },
    {
        meta: {
            title: 'Deep Residual Learning for Image Recognition',
            authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
            tags: ['CV', 'ResNet', 'Deep Learning'],
            date: '2015年12月10日',
            paperLink: 'https://arxiv.org/abs/1512.03385',
        },
        sections: [
            {
                id: 'intro',
                title: '简介',
                type: 'text',
                content: [
                    '更深的神经网络更难训练。',
                    '我们提出了一个残差学习框架，以简化比以前使用的网络深得多的网络的训练。',
                    '我们明确地将层重新表述为学习关于层输入的残差函数，而不是学习未参考的函数。'
                ],
            },
            {
                id: 'experiments',
                title: '实验',
                type: 'text',
                content: [
                    '我们在 ImageNet 数据集上评估了我们的残差网络，深度高达 152 层——比 VGG 网络深 8 倍，但复杂度更低。',
                    '这些残差网络在 ImageNet 测试集上实现了 3.57% 的错误率。'
                ],
            },
        ],
    },
    {
        meta: {
            title: 'Generative Adversarial Networks',
            authors: ['Ian J. Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza', 'et al.'],
            tags: ['CV', 'GAN', 'Generative Models'],
            date: '2014年6月10日',
            paperLink: 'https://arxiv.org/abs/1406.2661',
        },
        sections: [
            {
                id: 'intro',
                title: '简介',
                type: 'text',
                content: [
                    '我们提出了一个新的框架，用于通过对抗过程估计生成模型，其中我们同时训练两个模型：一个捕获数据分布的生成模型 G，和一个估计样本来自训练数据而不是 G 的概率的判别模型 D。',
                    'G 的训练过程是最大化 D 犯错的概率。'
                ],
            },
            {
                id: 'theory',
                title: '理论结果',
                type: 'text',
                content: [
                    '在任意函数 G 和 D 的空间中，存在唯一的解，其中 G 恢复训练数据分布，并且 D 处处等于 1/2。',
                    '在 G 和 D 由多层感知器定义的情况下，整个系统可以通过反向传播进行训练。'
                ],
            },
        ],
    },
];

async function seed() {
    const db = await getDb();

    // Clear existing data
    await db.exec('DELETE FROM papers');

    const stmt = await db.prepare('INSERT INTO papers (id, title, authors, tags, date, paperLink, sections) VALUES (?, ?, ?, ?, ?, ?, ?)');

    for (const paper of samplePapers) {
        const id = uuidv4();
        await stmt.run(
            id,
            paper.meta.title,
            JSON.stringify(paper.meta.authors),
            JSON.stringify(paper.meta.tags),
            paper.meta.date,
            paper.meta.paperLink,
            JSON.stringify(paper.sections)
        );
    }

    await stmt.finalize();
    console.log('Database seeded successfully with 5 papers!');
}

seed().catch(console.error);
