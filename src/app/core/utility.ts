import { FormControl, FormGroup } from '@angular/forms';
/**
 * Utility class for Gateway app
 */
export class Utility {
    
    static validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                if (!control.valid) {
                    console.log(field);                } 
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
}