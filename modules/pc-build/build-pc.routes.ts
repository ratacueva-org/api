/**
 * @swagger
 * components:
 *   schemas:
 *     PCBuildComponent:
 *       type: object
 *       properties:
 *         componentType:
 *           type: string
 *           enum: ["CPU", "GPU", "Motherboard", "RAM", "Storage", "PSU", "Case", "Cooler"]
 *           description: Type of PC component
 *           example: "GPU"
 *         productId:
 *           type: string
 *           description: Product ID of the component
 *           example: "64f8a1b2c3d4e5f6a7b8c9d1"
 *         productName:
 *           type: string
 *           description: Product name (populated from product)
 *           example: "NVIDIA GeForce RTX 4090"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of this component
 *           example: 1
 *         unitPrice:
 *           type: number
 *           description: Unit price of the component
 *           example: 35999.99
 *         totalPrice:
 *           type: number
 *           description: Total price for this component (unitPrice * quantity)
 *           example: 35999.99
 *         isCompatible:
 *           type: boolean
 *           description: Whether this component is compatible with the build
 *           example: true
 *         compatibilityNotes:
 *           type: string
 *           description: Notes about compatibility (optional)
 *           example: "Requires 850W+ PSU"
 *     PCBuild:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique PC build identifier
 *           example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *         userId:
 *           type: string
 *           description: User ID who created the build
 *           example: "64f8a1b2c3d4e5f6a7b8c9d2"
 *         buildName:
 *           type: string
 *           description: User-defined name for the build
 *           example: "Gaming Beast 2024"
 *         buildDescription:
 *           type: string
 *           description: Description of the build purpose
 *           example: "High-end gaming PC for 4K gaming and streaming"
 *         buildType:
 *           type: string
 *           enum: ["Gaming", "Workstation", "Office", "Budget", "Enthusiast"]
 *           description: Type of PC build
 *           example: "Gaming"
 *         components:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PCBuildComponent'
 *           description: Array of PC components in the build
 *         totalPrice:
 *           type: number
 *           description: Total price of all components
 *           example: 125999.95
 *         estimatedWattage:
 *           type: number
 *           description: Estimated power consumption in watts
 *           example: 650
 *         compatibilityScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Overall compatibility score (0-100)
 *           example: 95
 *         performanceRating:
 *           type: string
 *           enum: ["Entry Level", "Mid Range", "High End", "Enthusiast"]
 *           description: Performance rating of the build
 *           example: "High End"
 *         isPublic:
 *           type: boolean
 *           description: Whether the build is public for other users to see
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the build was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the build was last updated
 *     CreatePCBuildInput:
 *       type: object
 *       required:
 *         - buildName
 *         - buildType
 *         - components
 *       properties:
 *         buildName:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Name for the PC build
 *           example: "Gaming Beast 2024"
 *         buildDescription:
 *           type: string
 *           maxLength: 500
 *           description: Description of the build (optional)
 *           example: "High-end gaming PC for 4K gaming and streaming"
 *         buildType:
 *           type: string
 *           enum: ["Gaming", "Workstation", "Office", "Budget", "Enthusiast"]
 *           description: Type of PC build
 *           example: "Gaming"
 *         components:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - componentType
 *               - productId
 *               - quantity
 *             properties:
 *               componentType:
 *                 type: string
 *                 enum: ["CPU", "GPU", "Motherboard", "RAM", "Storage", "PSU", "Case", "Cooler"]
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *           minItems: 1
 *           description: Array of components for the build
 *         isPublic:
 *           type: boolean
 *           description: Whether to make the build public
 *           example: false
 */

import { Router } from "express";
import * as buildPcController from "./build-pc.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { authorize } from "../../core/middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * /api/build-pc:
 *   post:
 *     summary: Create a new PC build configuration
 *     description: Creates a new PC build configuration with component compatibility checking and performance analysis. Only authenticated clients can create builds.
 *     tags: [PC Build]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePCBuildInput'
 *           example:
 *             buildName: "Gaming Beast 2024"
 *             buildDescription: "High-end gaming PC for 4K gaming and streaming"
 *             buildType: "Gaming"
 *             components:
 *               - componentType: "CPU"
 *                 productId: "64f8a1b2c3d4e5f6a7b8c9d1"
 *                 quantity: 1
 *               - componentType: "GPU"
 *                 productId: "64f8a1b2c3d4e5f6a7b8c9d2"
 *                 quantity: 1
 *               - componentType: "Motherboard"
 *                 productId: "64f8a1b2c3d4e5f6a7b8c9d3"
 *                 quantity: 1
 *               - componentType: "RAM"
 *                 productId: "64f8a1b2c3d4e5f6a7b8c9d4"
 *                 quantity: 2
 *               - componentType: "Storage"
 *                 productId: "64f8a1b2c3d4e5f6a7b8c9d5"
 *                 quantity: 1
 *               - componentType: "PSU"
 *                 productId: "64f8a1b2c3d4e5f6a7b8c9d6"
 *                 quantity: 1
 *               - componentType: "Case"
 *                 productId: "64f8a1b2c3d4e5f6a7b8c9d7"
 *                 quantity: 1
 *             isPublic: false
 *     responses:
 *       201:
 *         description: PC build created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "PC build created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/PCBuild'
 *                 analysis:
 *                   type: object
 *                   properties:
 *                     compatibilityReport:
 *                       type: object
 *                       properties:
 *                         overallScore:
 *                           type: number
 *                           example: 95
 *                         issues:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               component:
 *                                 type: string
 *                               issue:
 *                                 type: string
 *                               severity:
 *                                 type: string
 *                                 enum: ["low", "medium", "high"]
 *                           example: []
 *                         recommendations:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Consider adding an additional case fan for better cooling"]
 *                     performanceEstimate:
 *                       type: object
 *                       properties:
 *                         gamingPerformance:
 *                           type: string
 *                           example: "Excellent for 4K gaming at high settings"
 *                         workstationPerformance:
 *                           type: string
 *                           example: "Great for content creation and rendering"
 *                         bottlenecks:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: []
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: One or more components not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *                 message:
 *                   type: string
 *                   example: "One or more selected components were not found"
 *                 missingComponents:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["64f8a1b2c3d4e5f6a7b8c9d1"]
 *       409:
 *         description: Component compatibility issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Conflict"
 *                 message:
 *                   type: string
 *                   example: "Major compatibility issues detected in the build"
 *                 compatibilityIssues:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       component:
 *                         type: string
 *                       issue:
 *                         type: string
 *                       severity:
 *                         type: string
 *                   example:
 *                     - component: "CPU"
 *                       issue: "CPU socket incompatible with motherboard"
 *                       severity: "high"
 */
router.post(
  "/",
  authenticate,
  authorize("client"),
  buildPcController.addBuildPc
);

export default router;
