import { Product } from '../models/Product.js';
import { MASTER_PRODUCTS } from '../data/catalogData.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { getDBStatus, assertDatabaseConnected } from '../config/db.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, material, finish, search, featured, page = 1, limit = 100 } = req.query;

    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const query = { status: { $ne: 'archived' } };
      const andClauses = [];

      if (category && category !== 'All') {
        andClauses.push({
          $or: [
            { categorySlug: category },
            { category: { $regex: category, $options: 'i' } }
          ]
        });
      }
      if (material && material !== 'All') andClauses.push({ material: { $regex: material, $options: 'i' } });
      if (finish && finish !== 'All') andClauses.push({ finish: { $regex: finish, $options: 'i' } });
      if (featured === 'true') andClauses.push({ featured: true });

      if (search) {
        const q = search.trim();
        andClauses.push({
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { slug: { $regex: q, $options: 'i' } },
            { standard: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } },
            { material: { $regex: q, $options: 'i' } }
          ]
        });
      }

      if (andClauses.length > 0) {
        query.$and = andClauses;
      }

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const [products, total] = await Promise.all([
        Product.find(query).sort({ priorityRank: 1, name: 1 }).skip(skip).limit(parseInt(limit, 10)),
        Product.countDocuments(query)
      ]);

      if (products.length > 0) {
        return successResponse(res, {
          products,
          pagination: {
            total,
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(total / parseInt(limit, 10))
          }
        });
      }
    }

    // In-memory master fallback if DB is still initializing
    let list = [...MASTER_PRODUCTS];
    if (category && category !== 'All') list = list.filter((p) => p.categorySlug === category);
    if (material && material !== 'All') list = list.filter((p) => p.material.includes(material));
    if (finish && finish !== 'All') list = list.filter((p) => p.finish.includes(finish));
    if (featured === 'true') list = list.filter((p) => p.featured);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.standard && p.standard.toLowerCase().includes(q))
      );
    }

    return successResponse(res, {
      products: list,
      pagination: {
        total: list.length,
        page: 1,
        limit: list.length,
        totalPages: 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const product = await Product.findOne({ slug });
      if (product) {
        return successResponse(res, product);
      }
    }

    // Master fallback
    const found = MASTER_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
    if (found) {
      return successResponse(res, found);
    }

    return errorResponse(res, 'Product not found', 404);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const {
      name,
      slug,
      sku,
      category,
      categorySlug,
      priorityRank,
      featured,
      material,
      finish,
      roughness,
      manufacturingType,
      standard,
      connection,
      sizes,
      wallThickness,
      length,
      mtc,
      availability,
      leadTime,
      image,
      images,
      video,
      has360View,
      view360Folder,
      overview,
      applications,
      seo
    } = req.body;

    if (!name || !slug || !category || !overview) {
      return errorResponse(res, 'Product name, slug, category, and overview are required', 400);
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
    const existing = await Product.findOne({ slug: cleanSlug });
    if (existing) {
      return errorResponse(res, `A product with slug [${cleanSlug}] already exists`, 409);
    }

    const product = await Product.create({
      name: name.trim(),
      slug: cleanSlug,
      sku: sku || `LT-${cleanSlug.toUpperCase()}`,
      category: category.trim(),
      categorySlug: categorySlug || cleanSlug,
      priorityRank: Number(priorityRank) || 99,
      featured: !!featured,
      material: material || 'SS 316L',
      finish: finish || 'Electro Polished (EP)',
      roughness: roughness || 'Ra ≤ 0.4 µm',
      manufacturingType: manufacturingType || 'Welded or Seamless',
      standard: standard || 'ASTM A270',
      connection: connection || 'Plain End / TC',
      sizes: sizes || 'Standard',
      wallThickness: wallThickness || '1.2 mm to 2.0 mm',
      length: length || '6.0 Meters Standard',
      mtc: mtc || 'EN 10204 3.1 Supplied',
      availability: availability || 'Ready Stock (Dispatch in 24-48h)',
      leadTime: leadTime || 'Immediate dispatch',
      image: image || '',
      images: Array.isArray(images) ? images : [image].filter(Boolean),
      video: video || '',
      has360View: !!has360View,
      view360Folder: view360Folder || '',
      overview,
      applications: Array.isArray(applications) ? applications : [],
      seo: seo || { title: `${name} | Lotus Tubes`, metaDescription: overview.slice(0, 150) },
      status: 'published'
    });

    return successResponse(res, product, 'Product added to catalogue successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const allowedFields = [
      'name',
      'sku',
      'category',
      'categorySlug',
      'priorityRank',
      'featured',
      'material',
      'finish',
      'roughness',
      'manufacturingType',
      'standard',
      'connection',
      'sizes',
      'wallThickness',
      'length',
      'mtc',
      'availability',
      'leadTime',
      'image',
      'images',
      'video',
      'has360View',
      'view360Folder',
      'overview',
      'applications',
      'seo',
      'status'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    return successResponse(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    assertDatabaseConnected();
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Soft delete / archive
    product.status = 'archived';
    await product.save();
    return successResponse(res, null, 'Product archived successfully');
  } catch (error) {
    next(error);
  }
};
