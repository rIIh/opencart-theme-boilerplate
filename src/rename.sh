lastName=${1?"Last name not provided"}
newName=${2?"New name not provided"}

mmv "admin/;$lastName*" "admin/#1$newName#2"
mmv "markup/twig/admin/;$lastName*" "markup/twig/admin/#1$newName#2"
[ -d markup/twig/catalog/view/theme/"$lastName" ] && mv markup/twig/catalog/view/theme/"$lastName" markup/twig/catalog/view/theme/"$newName"

find admin -type f -exec sed -i "s/ControllerExtensionTheme${lastName^}/ControllerExtensionTheme${newName^}/g" {} +
find admin -type f -exec sed -i "s/theme_$lastName\_directory/theme_$newName\_directory/g" {} +
find admin -type f -exec sed -i "s/= '$lastName'/= '$newName'/g" {} +
find . -type f -exec sed -i "s/theme_$lastName/theme_$newName/g" {} +
find . -type f -exec sed -i "s/theme\/$lastName/theme\/$newName/g" {} +
