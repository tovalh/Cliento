<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LeadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:leads,email',
            'source' => 'string|max:255'
        ]);

        try {
            $lead = Lead::create([
                'email' => $request->email,
                'source' => $request->source ?? 'landing_page'
            ]);

            return response()->json([
                'success' => true,
                'message' => '¡Gracias! Te contactaremos pronto.',
                'lead' => $lead
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hubo un error al guardar tu información. Inténtalo de nuevo.'
            ], 500);
        }
    }
}
