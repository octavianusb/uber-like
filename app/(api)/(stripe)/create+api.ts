import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            amount,
            paymentMethodId,
            userAddress,
            destinationAddress,
        } = body;

        if (!name || !email || !amount) {
            return Response.json({
                error: "Missing required fields",
                status: 400,
            });
        }

        let customer;
        const doesCustomerExist = await stripe.customers.list({
            email,
        });

        if (doesCustomerExist.data.length > 0) {
            customer = doesCustomerExist.data[0];
        } else {
            const newCustomer = await stripe.customers.create({
                name,
                email,
            });

            customer = newCustomer;
        }

        await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: "2024-06-20" },
        );

        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(amount) * 100,
            currency: "usd",
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
            payment_method: paymentMethodId,
            description: `Payment for ride from ${userAddress} to ${destinationAddress}`,
            setup_future_usage: "off_session",
        });

        const payment_method_id = paymentMethodId;
        const payment_intent_id = paymentIntent.id;
        const customer_id = customer.id;

        if (!payment_method_id || !payment_intent_id || !customer_id) {
            return Response.json({
                error: "Missing required payment information",
                status: 400,
            });
        }

        const paymentMethod = await stripe.paymentMethods.attach(
            payment_method_id,
            {
                customer: customer_id,
            },
        );
        const result = await stripe.paymentIntents.confirm(payment_intent_id, {
            payment_method: paymentMethod.id,
        });

        console.log(
            "ajunge pana aici, ce trimit pe return nu ajunge in UI ----> ",
            result,
        );

        return Response.json(
            {
                success: true,
                message: "Payment confirmed successfully",
                data: result,
            },
            { status: 201 },
        );
    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            status: 500,
            error,
        });
    }
}
